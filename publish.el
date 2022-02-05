;;; package --- This is the script that converts org files to html followed by publishing them
;;; Commentary:
;;; Source: https://gitlab.com/pages/org-mode

;;; package --- publish settings for local dev server
;;; Code:
(require 'org)
(require 'ox-publish)

(defconst bp (file-name-directory (or load-file-name buffer-file-name)))

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

(setq org-publish-project-alist
      (list
       (list "bitsofparag"
             :base-directory (concat bp "page-src")
             :base-extension "org"
             :recursive t
             :publishing-function '(org-html-publish-to-html)
             :publishing-directory (concat bp "dist")
             :exclude (regexp-opt '(".*/node_modules/.*" "README" "blog" "yml" "page-src" ".setup"))
             :auto-sitemap nil
             :html-doctype "html5"
             :language "en"
             :title "Parag's Personal Weblog"
             :description "I am Parag and this is my collection of thoughts, opinions on various topics as well as a space to promote OSS, theater, art & other creative projects"
             :keywords "parag, blog, opinion, thoughts, technology, experiments"
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
             :base-directory (concat bp "page-src/blog")
             :base-extension "org"
             :recursive t
             :publishing-function '(org-html-publish-to-html)  ;; Output directory
             :publishing-directory (concat bp "dist/blog")
             :exclude "index.org~"
             :html-doctype "html5"
             :language "en"
             :description "I am Parag and this is my collection of thoughts, opinions on various topics as well as a space to promote OSS, theater, art & other creative projects"
             :keywords "parag, blog, opinion, thoughts, technology, experiments"
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
       (list "bitsofparag-static"
             :base-directory (concat bp "site-assets")
             :base-extension site-attachments
             :publishing-directory (concat bp "dist/static")
             :publishing-function 'org-publish-attachment
             :recursive t)
       (list "bitsofparag-misc"
             :base-directory (concat bp)
             :base-extension site-misc
             :publishing-directory (concat bp "dist")
             :publishing-function 'org-publish-attachment
             :recursive t)
       (list "personal-website" :components '("bitsofparag"
                                              "bitsofparag-blog"
                                              "bitsofparag-static"
                                              "bitsofparag-misc"
                                              ))))
