#!/bin/bash
set -e

ROOT="$(git rev-parse --show-toplevel)"


"${ROOT}/test/test.java.sh"

"${ROOT}/test/test.pascal.sh"