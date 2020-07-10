TAG=latest
REPO=registry.gitlab.com/clink1/building-management-apps-web/web:${TAG}

npmbuild:
	rm -rf build
	npm run build

build: npmbuild
	docker build -t ${REPO} .

push:
	docker push ${REPO} 

start: 
	echo "Running dockerized instance of web apps, access at localhost:8080/"
	docker run -it -p 8080:80 ${REPO}


.PHONY: build
