#
# WebComponents Snake Game
# Components Makefile
#

BUILDDIR=../../build/components
FILES=polymer.html polymer-micro.html polymer-mini.html webcomponents.min.js

all: score snake starfield
	cd score; make all
	cd snake; make all
	cd starfield; make all
	cp ${FILES} ${BUILDDIR}/

clean:
	cd score; make clean
	cd snake; make clean
	cd starfield; make clean

