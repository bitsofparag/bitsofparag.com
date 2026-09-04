;;; package --- This is the script that converts org files to html followed by publishing them
;;; Commentary:
;;; Source: https://gitlab.com/pages/org-mode

;;; package --- publish settings for local dev server
;;; Code:
(require 'org)
(require 'ox-publish)

(defconst bip-root (file-name-directory (or load-file-name buffer-file-name)))

(add-to-list 'load-path (concat bip-root "lib"))
(require 'htmlize)
(require 'ox-rss)

;;; If using f.el, uncomment the following lines
;; (require 'f)
;; (defvar *weblog-html-preamble*
;;   (f-read-text "./page-src/preamble.html" 'utf-8))
;; (defvar *weblog-html-postamble*
;;   (f-read-text "./page-src/postamble.html" 'utf-8))
;; (defvar *weblog-html-common-head*
;;   (f-read-text "./page-src/common-head.html" 'utf-8))
;; (defvar *weblog-html-extra-head*
;;   ""
;;   )

(defconst bip-url-home "https://bitsofparag.com/"
  "The home page URL of the website.")
(defconst bip-title "Parag Majumdar - Writings & Microblog"
  "Title of the website.")
(defconst bip-desc "Writings and microblog posts by Parag Majumdar about anything that wanders my way."
  "Description of the website.")
(defconst bip-keywords "parag, parag m, blog, opinion, thoughts, technology, experiments"
  "Website keywords for SEO.")

(defvar *weblog-html-postamble* (with-temp-buffer
                                  (insert-file-contents "./page-src/postamble.html")
                                  (buffer-string)))
(defvar *weblog-html-preamble* (with-temp-buffer
                                 (insert-file-contents "./page-src/preamble.html")
                                 (buffer-string)))
(defvar *weblog-html-common-head* (with-temp-buffer
                                    (insert-file-contents "./page-src/common-head.html")
                                    (buffer-string)))
(defvar *weblog-html-extra-head* "")

(defvar site-attachments (regexp-opt '("gif" "jpg" "jpeg" "png" "svg"
                                       "ico" "cur" "css" "js" "html"
                                       "woff2" "woff" "ttf" "pdf")))
(defvar site-misc (regexp-opt '("webmanifest")))

(setq org-html-htmlize-output-type 'css)
(setq display-time-day-and-date t)
(setq org-publish-use-timestamps-flag nil)
(setq user-full-name "Parag Majumdar")
(setq user-mail-address "admin@bitsofparag.com")
(setq org-html-home/up-format "")

(setq org-export-with-section-numbers nil
      org-export-with-smart-quotes t)

(setq org-html-divs '((preamble "header" "header")
                      (content "article" "content")
                      (postamble "footer" "footer"))
      org-html-metadata-timestamp-format "%Y-%m-%d"
      org-html-checkbox-type 'html)

;; --------------------------------
;; Custom sitemap generator code
;; Derived from https://nicolasknoebber.com/posts/blogging-with-emacs-and-org.html
(defun bip-format-sitemap-entry (entry _style project)
  "Format ENTRY in PROJECT.
Formats the entry title and publication date."
  (if (equal "rss.org" entry) ""
    (format "[[file:%s][%s]] =%s="
	    entry
	    (org-publish-find-title entry project)
	    (format-time-string "%Y-%m-%d" (org-publish-find-date entry project)))))

;; (defun bip-format-exported-timestamps(timestamp _backend _channel)
;;   "Remove <> from exported org TIMESTAMP."
;;   (print (replace-regexp-in-string "&[lg]t;" "" timestamp))
;;   (replace-regexp-in-string "&[lg]t;" "" timestamp)
;; )

;; ---------------------------------------
;; Custom RSS feed generator code.
(defun bip-format-rss-feed-entry (entry _style project)
  "Format public content ENTRY for the RSS feed.
Only writings and microblog entries belong in the feed."
  (when (or (string-prefix-p "blog/" entry)
            (string-prefix-p "microblog/" entry))
    (let* ((title (org-publish-find-title entry project))
           (link (concat (file-name-sans-extension entry) ".html"))
           (pubdate (format-time-string
                     (car org-time-stamp-formats)
                     (org-publish-find-date entry project))))
      (format "* %s\n:PROPERTIES:\n:RSS_PERMALINK: %s\n:PUBDATE: %s\n:END:\n"
              title
              link
              pubdate))))

(defun bip-generate-rss-feed (title list)
  "Generate an Org source document for the RSS feed.
TITLE is the feed title. LIST contains sitemap entries."
  (concat "#+TITLE: " title "\n"
          "#+DESCRIPTION: " bip-desc "\n\n"
          (org-list-to-subtree list 1 '(:icount "" :istart ""))))

(defun bip-org-rss-publish-to-rss (plist filename pub-dir)
  "Publish the generated RSS sitemap as XML.
PLIST contains project settings. FILENAME is the sitemap source.
PUB-DIR is the output directory."
  (when (equal "rss.org" (file-name-nondirectory filename))
    (org-rss-publish-to-rss plist filename pub-dir)))

;; ---------------------------------------
;; Publish list
(setq org-publish-project-alist
      (list
       (list "bitsofparag"
             :base-directory (concat bip-root "page-src")
             :base-extension "org"
             :recursive t
             :publishing-function 'org-html-publish-to-html
             :publishing-directory (concat bip-root "dist")
             :exclude (regexp-opt '(".*/node_modules/.*" "README" "blog" "microblog" "notes" "now" "rss" "drafts" "yml" "page-src" ".setup"))
             :auto-sitemap nil
             :html-doctype "html5"
             :language "en"
             :title bip-title
             :description bip-desc
             :keywords bip-keywords
             :with-date t
             :html-head-include-default-style nil      ;; Do not include predefined header scripts.
             :html-head-include-scripts nil
             :html-head *weblog-html-common-head*
             :html-head-extra *weblog-html-extra-head*
             :html-link-home "/"
             :html-preamble *weblog-html-preamble*
             :html-container "section"
             :html-postamble *weblog-html-postamble*
             :html-link-use-abs-url nil
             :html-scripts: nil
             :html-style: nil
             :html5-fancy: t
             :tex t
             :sitemap-sort-files 'anti-chronologically)
       (list "bitsofparag-writings"
             :base-directory (concat bip-root "page-src/blog")
             :base-extension "org"
             :recursive t
             :publishing-function 'org-html-publish-to-html  ;; Output directory
             :publishing-directory (concat bip-root "dist/blog")
             :exclude "index.org~"
             :html-doctype "html5"
             :language "en"
             :title bip-title
             :description bip-desc
             :keywords bip-keywords
             :with-date t
             :html-head-include-default-style nil      ;; Do not include predefined header scripts.
             :html-head-include-scripts nil
             :html-head *weblog-html-common-head*
             :html-head-extra *weblog-html-extra-head*
             :html-preamble *weblog-html-preamble*
             :html-container "section"
             :html-container-class "blog"
             :html-postamble *weblog-html-postamble*
             :html-link-use-abs-url nil
             :htmlized-source t
             :html-scripts: nil
             :html-style: t
             :html5-fancy: t
             :auto-sitemap t
             :sitemap-filename "index.org"
             :sitemap-title "Writings"
             :sitemap-format-entry 'bip-format-sitemap-entry
             :sitemap-style 'list
             :sitemap-sort-files 'anti-chronologically
             )
       (list "bitsofparag-microblog"
             :base-directory (concat bip-root "page-src/microblog")
             :base-extension "org"
             :recursive t
             :publishing-function 'org-html-publish-to-html  ;; Output directory
             :publishing-directory (concat bip-root "dist/microblog")
             :exclude "index.org~"
             :html-doctype "html5"
             :language "en"
             :title "Microblog"
             :description "Parag's microblog, a Tumblr-like feed where he shares small updates - thoughts, learnings, photos, sketches, interesting links, favorite quotes and other fragments of information."
             :keywords bip-keywords
             :with-date t
             :html-head-include-default-style nil      ;; Do not include predefined header scripts.
             :html-head-include-scripts nil
             :html-head *weblog-html-common-head*
             :html-head-extra *weblog-html-extra-head*
             :html-preamble *weblog-html-preamble*
             :html-container "section"
             :html-container-class "microblog"
             :html-postamble *weblog-html-postamble*
             :html-link-use-abs-url nil
             :htmlized-source t
             :html-scripts: nil
             :html-style: t
             :html5-fancy: t
             :auto-sitemap nil
             )
       (list "bitsofparag-rss"
             :base-directory (concat bip-root "page-src")
             :base-extension "org"
             :publishing-directory (concat bip-root "dist")
             :publishing-function 'bip-org-rss-publish-to-rss
             :recursive t
             :exclude (regexp-opt '("404.org" "colophon.org" "gpg.org" "index.org"
                                    "now.org" "notes" "privacy.org" "rss.org"
                                    "drafts" "blog/index.org" "microblog/index.org"))
             :table-of-contents nil
             :rss-image-url (concat bip-url-home "static/images/android-chrome-512x512.png")
             :rss-extension "xml"
             :rss-feed-url (concat bip-url-home "rss.xml")
             :auto-sitemap t
             :html-link-home bip-url-home
             :html-link-use-abs-url t
             :html-link-org-files-as-html t
             :section-numbers nil
             :sitemap-filename "rss.org"
             :sitemap-title bip-title
             :sitemap-style 'list
             :sitemap-sort-files 'anti-chronologically
             :sitemap-function 'bip-generate-rss-feed
             :sitemap-format-entry 'bip-format-rss-feed-entry
             :author user-full-name
             :email "")
       (list "bitsofparag-static"
             :base-directory (concat bip-root "site-assets")
             :base-extension site-attachments
             :publishing-directory (concat bip-root "dist/static")
             :publishing-function 'org-publish-attachment
             :recursive t)
       (list "bitsofparag-misc"
             :base-directory (concat bip-root "page-src")
             :base-extension site-misc
             :publishing-directory (concat bip-root "dist")
             :publishing-function 'org-publish-attachment
             :recursive t)
       (list "website" :components '("bitsofparag"
                                     "bitsofparag-writings"
                                     "bitsofparag-microblog"
                                     "bitsofparag-static"
                                     "bitsofparag-misc"
                                     ))
       (list "rss" :components '("bitsofparag-rss"))
       ))

(provide 'publish)
;;; publish.el ends here
