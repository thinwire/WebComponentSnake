#
# WebComponents Snake Game Source
# Main Makefile
#

BUILDDIR=../build
FILES=index.html snake.css favicon.ico

all: components
	cd components; make all
	tsc main.ts --outFile ${BUILDDIR}/main.js
	cp ${FILES} ${BUILDDIR}/

clean:
	echo "Nothing to clean"

