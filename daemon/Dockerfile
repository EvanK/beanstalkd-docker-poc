FROM alpine:3.3

EXPOSE 11300

ENV BEANSTALKD_VERSION="1.10"

RUN apk --update add --virtual build-dependencies \
  gcc \
  make \
  musl-dev \
  curl \
  && curl -sL https://github.com/kr/beanstalkd/archive/v$BEANSTALKD_VERSION.tar.gz | tar xvz -C /tmp \
  && cd /tmp/beanstalkd-$BEANSTALKD_VERSION \
  && sed -i "s|#include <sys/fcntl.h>|#include <fcntl.h>|g" sd-daemon.c \
  && make \
  && cp beanstalkd /usr/bin \
  && apk del build-dependencies \
  && rm -rf /tmp/* \
  && rm -rf /var/cache/apk/*

RUN mkdir -p /var/beanstalkd \
  && chown nobody:nobody /var/beanstalkd \
  && chmod 0755 /var/beanstalkd

VOLUME ["/var/beanstalkd"]

CMD ["beanstalkd", "-b", "/var/beanstalkd", "-u", "nobody", "-V"]
