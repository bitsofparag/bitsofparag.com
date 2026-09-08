package main

import (
	"fmt"
	"io/fs"
	"os"
	"os/exec"
	"path/filepath"
	"slices"
	"strings"
)

const webPQuality = "79"

type optimizerOptions struct {
	ImagesRoot string
}

type (
	imageEncoder  func(source, target string) error
	commandRunner func(name string, args ...string) ([]byte, error)
)

func main() {
	if err := run(os.Args[1:]); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func run(args []string) error {
	options, err := parseOptions(args)
	if err != nil {
		return err
	}
	return optimizeImages(options, newWebPEncoder(executeCommand))
}

func parseOptions(args []string) (optimizerOptions, error) {
	if len(args) != 1 || strings.TrimSpace(args[0]) == "" {
		return optimizerOptions{}, fmt.Errorf("usage: image-optimizer <images-root>")
	}
	return optimizerOptions{ImagesRoot: filepath.Clean(args[0])}, nil
}

func optimizeImages(options optimizerOptions, encode imageEncoder) error {
	images, err := discoverImages(options.ImagesRoot)
	if err != nil {
		return err
	}
	for _, source := range images {
		target := webPTarget(source)
		if err := encode(source, target); err != nil {
			return fmt.Errorf("optimize %s: %w", source, err)
		}
	}
	return nil
}

func discoverImages(imagesRoot string) ([]string, error) {
	var images []string
	err := filepath.WalkDir(imagesRoot, func(path string, entry fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !entry.IsDir() && supportedImage(path) {
			images = append(images, path)
		}
		return nil
	})
	if err != nil {
		return nil, fmt.Errorf("scan images in %s: %w", imagesRoot, err)
	}

	slices.Sort(images)
	return images, nil
}

func supportedImage(path string) bool {
	switch strings.ToLower(filepath.Ext(path)) {
	case ".jpg", ".jpeg", ".png":
		return true
	default:
		return false
	}
}

func webPTarget(source string) string {
	extension := filepath.Ext(source)
	return strings.TrimSuffix(source, extension) + ".webp"
}

func newWebPEncoder(runCommand commandRunner) imageEncoder {
	return func(source, target string) error {
		arguments := []string{
			"-quiet", "-q", webPQuality, "-sharp_yuv", "-metadata", "none",
			source, "-o", target,
		}
		output, err := runCommand("cwebp", arguments...)
		if err != nil {
			return fmt.Errorf("cwebp: %w: %s", err, strings.TrimSpace(string(output)))
		}
		return nil
	}
}

func executeCommand(name string, args ...string) ([]byte, error) {
	return exec.Command(name, args...).CombinedOutput()
}
