set -e
echo ====== TEST PASCAL ======

ROOT="$(git rev-parse --show-toplevel)"


for problem in "${ROOT}/test/test-suite/problems/"*; do
	problem_name=$(basename "${problem}")

	npx rekarel compile "${problem}/solution.kp" -o "${ROOT}/bin/${problem_name}.kx"

    echo -n "${problem_name} .................. RUNING                      "
    start_time=$(date +%s)
	for casename in "${problem}/cases"/*.in; do
        case_name=$(basename "${casename}")

		{
            npx rekarel run "${ROOT}/bin/${problem_name}.kx" < "${casename}" | diff -Naurw --ignore-blank-lines "${casename%.in}.out" -
        } &
    done
    wait
    # End the timer
    end_time=$(date +%s)
    
    # Calculate the elapsed time
    elapsed_time=$((end_time - start_time))
    echo -ne "\r${problem_name} .................. DONE ${elapsed_time} seconds                               \n"
done