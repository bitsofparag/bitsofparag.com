package main

import (
	"errors"
	"os"
	"path/filepath"
	"reflect"
	"strings"
	"testing"
)

func TestParseOptions(t *testing.T) {
	t.Parallel()
	tests := []struct {
		name      string
		args      []string
		wantRoot  string
		wantError string
	}{
		{name: "image root", args: []string{"dist/static/images"}, wantRoot: "dist/static/images"},
		{name: "missing root", wantError: "usage"},
		{name: "extra argument", args: []string{"images", "extra"}, wantError: "usage"},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			t.Parallel()
			options, err := parseOptions(test.args)
			if test.wantError != "" {
				if err == nil || !strings.Contains(err.Error(), test.wantError) {
					t.Fatalf("parseOptions() error = %v, want %q", err, test.wantError)
				}
				return
			}
			if err != nil {
				t.Fatalf("parseOptions() error = %v", err)
			}
			if options.ImagesRoot != test.wantRoot {
				t.Fatalf("ImagesRoot = %q, want %q", options.ImagesRoot, test.wantRoot)
			}
		})
	}
}

func TestRunRejectsMissingOptions(t *testing.T) {
	t.Parallel()
	if err := run(nil); err == nil || !strings.Contains(err.Error(), "usage") {
		t.Fatalf("run() error = %v, want usage error", err)
	}
}

func TestDiscoverImages(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	writeFixture(t, filepath.Join(root, "z.PNG"))
	writeFixture(t, filepath.Join(root, "nested", "a.jpeg"))
	writeFixture(t, filepath.Join(root, "already.webp"))
	writeFixture(t, filepath.Join(root, "badge.svg"))

	images, err := discoverImages(root)
	if err != nil {
		t.Fatalf("discoverImages() error = %v", err)
	}
	want := []string{
		filepath.Join(root, "nested", "a.jpeg"),
		filepath.Join(root, "z.PNG"),
	}
	if !reflect.DeepEqual(images, want) {
		t.Fatalf("discoverImages() = %v, want %v", images, want)
	}
}

func TestDiscoverImagesRejectsMissingRoot(t *testing.T) {
	t.Parallel()
	_, err := discoverImages(filepath.Join(t.TempDir(), "missing"))
	if err == nil || !strings.Contains(err.Error(), "scan images") {
		t.Fatalf("discoverImages() error = %v, want scan error", err)
	}
}

func TestOptimizeImages(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	first := filepath.Join(root, "first.jpg")
	second := filepath.Join(root, "nested", "second.png")
	writeFixture(t, first)
	writeFixture(t, second)

	type call struct{ source, target string }
	var calls []call
	encode := func(source, target string) error {
		calls = append(calls, call{source: source, target: target})
		return nil
	}
	if err := optimizeImages(optimizerOptions{ImagesRoot: root}, encode); err != nil {
		t.Fatalf("optimizeImages() error = %v", err)
	}
	want := []call{
		{source: first, target: filepath.Join(root, "first.webp")},
		{source: second, target: filepath.Join(root, "nested", "second.webp")},
	}
	if !reflect.DeepEqual(calls, want) {
		t.Fatalf("encoder calls = %v, want %v", calls, want)
	}
}

func TestOptimizeImagesReturnsEncoderError(t *testing.T) {
	t.Parallel()
	root := t.TempDir()
	writeFixture(t, filepath.Join(root, "broken.jpg"))
	encode := func(_, _ string) error { return errors.New("encoder failed") }

	err := optimizeImages(optimizerOptions{ImagesRoot: root}, encode)
	if err == nil || !strings.Contains(err.Error(), "optimize") {
		t.Fatalf("optimizeImages() error = %v, want optimizer error", err)
	}
}

func TestWebPEncoder(t *testing.T) {
	t.Parallel()
	var command string
	var arguments []string
	run := func(name string, args ...string) ([]byte, error) {
		command = name
		arguments = args
		return nil, nil
	}

	if err := newWebPEncoder(run)("source.jpg", "target.webp"); err != nil {
		t.Fatalf("encode() error = %v", err)
	}
	if command != "cwebp" {
		t.Fatalf("command = %q, want cwebp", command)
	}
	want := []string{"-quiet", "-q", "79", "-sharp_yuv", "-metadata", "none", "source.jpg", "-o", "target.webp"}
	if !reflect.DeepEqual(arguments, want) {
		t.Fatalf("arguments = %v, want %v", arguments, want)
	}
}

func TestWebPEncoderReturnsCommandOutput(t *testing.T) {
	t.Parallel()
	run := func(_ string, _ ...string) ([]byte, error) {
		return []byte("bad image"), errors.New("exit status 1")
	}
	err := newWebPEncoder(run)("source.jpg", "target.webp")
	if err == nil || !strings.Contains(err.Error(), "bad image") {
		t.Fatalf("encode() error = %v, want command output", err)
	}
}

func TestExecuteCommand(t *testing.T) {
	t.Parallel()
	output, err := executeCommand("sh", "-c", "printf result")
	if err != nil {
		t.Fatalf("executeCommand() error = %v", err)
	}
	if string(output) != "result" {
		t.Fatalf("executeCommand() output = %q, want result", output)
	}
}

func TestExecuteCommandReturnsError(t *testing.T) {
	t.Parallel()
	if _, err := executeCommand("sh", "-c", "exit 7"); err == nil {
		t.Fatal("executeCommand() error = nil, want command error")
	}
}

func writeFixture(t *testing.T, path string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatalf("create fixture directory: %v", err)
	}
	if err := os.WriteFile(path, []byte("fixture"), 0o644); err != nil {
		t.Fatalf("write fixture: %v", err)
	}
}
