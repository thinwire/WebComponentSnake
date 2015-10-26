#
# WebComponents Snake Game
# Main Makefile
#

all: clean src
	cd src; make all
	
clean:
	cd src; make clean
	rm -rf build/*

