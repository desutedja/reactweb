# VERSION ?= b9fef8b-2209202002
# export VERSION=$(git show --format=%h -q)-$(date "+%j%H%M%S")
export ENV?=development
export REPO=registry.gitlab.com/clink1/building-management-apps-web/adminweb:${VERSION}

# BASE ?= api.yipy.id
# PREFIX ?= yipy
# BASE ?= api-dev.yipy.id
# PREFIX ?= yipy

ifeq (${ENV},production)
BASE = api.yipy.id
PREFIX = yipy
else
BASE = api-dev.yipy.id
PREFIX = yipy
endif

endpoint: 
	chmod +x replace_endpoint.sh
	ENDPOINT_BASE=${BASE} ENDPOINT_PREFIX=${PREFIX} ./replace_endpoint.sh

npmbuild: endpoint
	rm -rf build build-sa build-bm
	REACT_APP_DEFAULT_ROLE=sa npm run build
	mv build build-sa
	REACT_APP_DEFAULT_ROLE=bm npm run build
	mv build build-bm

build: 
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

deploy-dev:
	firebase deploy --only hosting:yipy-dev-management
	firebase deploy --only hosting:yipy-dev-admin

.PHONY: build endpoint npmbuild push start test
