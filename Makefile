
dist:
	npm install --verbose --no-optional --registry=https://registry.npm.taobao.org && \
	npm run build

clean:
	rm -rf dist

.PHONY: dist
