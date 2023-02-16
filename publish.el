;;; package --- This is the script that converts org files to html followed by publishing them
;;; Commentary:
;;; Source: https://gitlab.com/pages/org-mode

;;; package --- publish settings for local dev server
;;; Code:
(require 'org)
(require 'ox-publish)

(defconst bip-root (file-name-directory (or load-file-name buffer-file-name)))

(add-to-list 'load-path (concat bip-root "lib"))
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

(defvar bip-url-home "https://bitsofparag.com/"
  "The home page url of the website.")
(defvar bip-title "Parag's Personal Weblog"
  "Title of the website.")
(defvar bip-desc "I am Parag and this is my personal site where I document my work and highlights of my life as well as write about various topics"
  "Description of the website.")
(defvar bip-keywords "parag, blog, opinion, thoughts, technology, experiments"
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
(setq user-full-name "Parag M.")
(setq user-mail-address "admin@bitsofparag.com")
(setq org-html-home/up-format "")

(setq org-export-with-section-numbers nil
      org-export-with-smart-quotes t)

(setq org-html-divs '((preamble "header" "header")
                      (content "article" "content")
                      (postamble "footer" "footer"))
      org-html-metadata-timestamp-format "%d-%m-%Y"
      org-html-checkbox-type 'html)

;; --------------------------------
;; Custom rss feed generator code.
;; Derived from https://nicolasknoebber.com/posts/blogging-with-emacs-and-org.html#org9edef43
(defun bip-format-rss-feed-entry (entry _style project)
  "Format ENTRY for the RSS feed.
ENTRY is a file name.
STYLE is either 'list' or 'tree'.
PROJECT is the current project."
  (let* (
         (title (org-publish-find-title entry project))
         (link (concat (file-name-sans-extension entry) ".html"))
         (pubdate (format-time-string (car org-time-stamp-formats)
          (org-publish-find-date entry project))))
    (message "%s %s" pubdate entry)
    (format "%s
:properties:
:rss_permalink: %s
:pubdate: %s
:end:\n"
            title
            (concat bip-url-home link)
            pubdate)))

(defun bip-generate-rss-feed (title list)
  "Generate RSS feed, as a string.
TITLE is the title of the RSS feed.
LIST is an internal representation for the files to include,
as returned by `org-list-to-subtree'.
PROJECT is the current project."
  (concat "#+TITLE: " title "\n\n"
          (org-list-to-subtree list 1 '(:icount "" :istart ""))))

(defun bip-org-rss-publish-to-rss (plist filename pub-dir)
  "Publish RSS with PLIST, only when FILENAME is 'rss.org'.
PUB-DIR is when the output will be placed."
  (if (equal "rss.org" (file-name-nondirectory filename))
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
             :exclude (regexp-opt '(".*/node_modules/.*" "README" "blog" "drafts" "yml" "page-src" ".setup"))
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
       (list "bitsofparag-blog"
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
             :sitemap-title "Latest posts"
             ;; :sitemap-file-entry-format "%d *%t*"
             :sitemap-style 'list
             :sitemap-sort-files 'anti-chronologically
             )
       (list "bitsofparag-notes"
             :base-directory (concat bip-root "page-src/notes")
             :base-extension "org"
             :recursive t
             :publishing-function 'org-html-publish-to-html  ;; Output directory
             :publishing-directory (concat bip-root "dist/notes")
             :exclude "index.org~"
             :html-doctype "html5"
             :language "en"
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
             :sitemap-title "Notes"
             ;; :sitemap-file-entry-format "%d *%t*"
             :sitemap-style 'list
             :sitemap-sort-files 'anti-chronologically
             )
       (list "bitsofparag-rss"
             :base-directory (concat bip-root "page-src")
             :base-extension "org"
             :rss-extension "xml"
             :recursive t
             :exclude (regexp-opt '("colophon.org" "rss.org" "index.org" "drafts" "404.org"))
             :publishing-function 'org-rss-publish-to-rss
             :publishing-directory (concat bip-root "dist")
             :auto-sitemap t
             :html-link-use-abs-url t
             :html-link-org-files-as-html t
             :sitemap-filename "rss.org"
             :sitemap-title bip-title
             :sitemap-style 'list
             :sitemap-sort-files 'anti-chronologically
             :sitemap-function 'bip-generate-rss-feed
             :sitemap-format-entry 'bip-format-rss-feed-entry
             :author user-full-name
             :email ""
             )
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
       (list "personal-website" :components '("bitsofparag"
                                              "bitsofparag-blog"
                                              "bitsofparag-notes"
                                              "bitsofparag-rss"
                                              "bitsofparag-static"
                                              "bitsofparag-misc"
                                              ))))

(provide 'publish)
;;; publish.el ends here
