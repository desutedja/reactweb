TAG = latest
REPO = registry.gitlab.com/clink1/building-management-apps-web/adminweb:${TAG}

BASE ?= api.yipy.id
PREFIX ?= yipy

endpoint: 
	chmod +x replace_endpoint.sh
	ENDPOINT_BASE=${BASE} ENDPOINT_PREFIX=${PREFIX} ./replace_endpoint.sh

npmbuild: endpoint
	rm -rf build build-sa build-bm
	REACT_APP_DEFAULT_ROLE=sa npm run build
	mv build build-sa
	REACT_APP_DEFAULT_ROLE=bm npm run build
	mv build build-bm

build: npmbuild
	docker build -t ${REPO} .

push: 
	docker push ${REPO} 

start: 
	echo "Running dockerized instance of web apps, access at localhost:8080/"
	docker run -it -p 80:80 ${REPO}

test:
	docker build -t appsweb .
	docker stop appsweb; docker rm appsweb;
	docker run -dt -p 80:80 --name appsweb appsweb:latest

.PHONY: build endpoint npmbuild push start test
