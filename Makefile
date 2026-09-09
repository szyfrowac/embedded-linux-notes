# Makefile for Embedded Linux Notes Documentation & LaTeX Project

BUILD_DIR = output
SRC_DIR = src
TARGET = embedded_linux_lecture_notes

.PHONY: all clean pdf html dev

all: html pdf

html:
	@echo "Building HTML Web Documentation Site..."
	npm run docs:build

dev:
	@echo "Starting Live HTML Web Documentation Server..."
	npm run docs:dev

pdf:
	@mkdir -p $(BUILD_DIR)
	@echo "Compiling LaTeX Document (Pass 1)..."
	cd $(SRC_DIR) && pdflatex -interaction=nonstopmode -output-directory=../$(BUILD_DIR) main.tex > /dev/null
	@echo "Compiling LaTeX Document (Pass 2 for TOC & Labels)..."
	cd $(SRC_DIR) && pdflatex -interaction=nonstopmode -output-directory=../$(BUILD_DIR) main.tex > /dev/null
	@mv $(BUILD_DIR)/main.pdf $(BUILD_DIR)/$(TARGET).pdf
	@echo "Compilation Complete! Generated: $(BUILD_DIR)/$(TARGET).pdf"

clean:
	@rm -rf $(BUILD_DIR)/* docs/.vitepress/dist docs/.vitepress/cache
	@echo "Cleaned build output directories."
