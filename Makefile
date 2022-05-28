###############################################################################
#
# @description Commands to setup, develop and deploy the project
# @author Parag M. <admin@bitsofparag.com>
#
###############################################################################
SHELL := /bin/bash

include .env
export

.DEFAULT_GOAL := help

# ---- Makefile help utility function
define PRINT_HELP_PYSCRIPT
import re, sys
for line in sys.stdin:
	match = re.match(r'^([a-zA-Z_-]+):.*?## (.*)$$', line)
	if match:
		target, help = match.groups()
		print("%-20s %s" % (target, help))
endef

export PRINT_HELP_PYSCRIPT

.PHONY: help get-version
help:
	@python3 -c "$$PRINT_HELP_PYSCRIPT" < $(MAKEFILE_LIST)

get-version: ## Get project version
	@if [[ -f package.json ]]; then awk -F \" '/"version": ".+"/ { print $$4; exit; }' package.json; fi

upload-images-folder: dist/static/images/$(FOLDER_NAME)/* ## Upload images
	for filepath in $^; do \
		curl -o /tmp/_cf_put.tmp -# \
			-X PUT \
			--data-binary @$$filepath \
			--user $$(cat secret) \
			-H "X-Custom-Auth-Key: ${AUTH_KEY_SECRET}" \
			"${BUCKET_URL}/${FOLDER_NAME}/`basename $$filepath`"; \
	done
	rm -f /tmp/_cf_put.tmp
