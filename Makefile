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

# The corresponding AWS Sig4 curl command looks like so:
#
# curl --location --request PUT 'https://<account-id>.r2.cloudflarestorage.com' \
# --header 'X-Amz-Content-Sha256: <generated hash>' \
# --header 'X-Amz-Date: 20221015T171516Z' \
# --header 'Authorization: AWS4-HMAC-SHA256 Credential=<api key>/20221015/auto/s3/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=<sign>' \
# --data-binary <image file>
#
upload-images-folder: dist/static/images/$(FOLDER_NAME)/* ## Upload images from folder
	for filepath in $^; do \
		curl -o /tmp/_cf_put.tmp -# \
			-X PUT \
			--data-binary @$$filepath \
			--user $$(cat secret) \
			-H "X-Custom-Auth-Key: ${AUTH_KEY_SECRET}" \
			"${BUCKET_URL}/${FOLDER_NAME}/`basename $$filepath`"; \
	done
	rm -f /tmp/_cf_put.tmp

upload-image: ## Upload single image
ifeq ($(IMAGE_PATH), )
	@echo "Usage: IMAGE_PATH=/path/to/cat-pic.jpg make upload-image"
	@exit 1
endif
	curl -o /tmp/_cf_put.tmp -# \
		-X PUT \
		--user "${R2_ACCESS_KEY_ID}:${R2_SECRET_ACCESS_KEY}" \
		--data-binary @${IMAGE_PATH} \
		--aws-sigv4 "aws:amz" \
		"${BUCKET_URL}/`basename ${IMAGE_PATH}`";
	@echo "======= cURL output ======"
	@cat /tmp/_cf_put.tmp && echo
	@rm -f /tmp/_cf_put.tmp
