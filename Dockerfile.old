FROM nginx:1.19
COPY ./build-sa /var/www/superadmin
COPY ./build-bm /var/www/management
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
