.PHONY: gen-api
gen-api:
	$(info Generating contracts from swagger on localhost...)
	npx openapi-typescript http://127.0.0.1:8888/swagger.json --output src/api/contract.d.ts --path-params-as-types

.PHONY: .build
.build:
	$(info Building sources...)
	npx vite build --mode development

.PHONY: .copy
.copy:
	$(info Copying sources into monisens folder...)
	rm -R ../monisens/app_data/*
	cp -R dist/* ../monisens/app_data

.PHONY: copy-build
copy-build: .build .copy
