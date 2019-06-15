const characterSelection = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:? ';
// const characterSelection = 'ha';


function randomString(length) {
    var result = '';
    var characters = characterSelection;
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function randomChar() {
    var characters = characterSelection;
    return characters[Math.floor(Math.random() * characters.length)];
}

function randomSelection(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * returns true if generate random number between 0-1 is less than percentChance
 * @param {*} percentChance 
 */
function rollRandomChance(percentChance) {
    let chance = Math.random();
    return chance <= percentChance;

}

class Individual {
    constructor(genome = "", fitness = 0) {
        this.genome = genome;
        this.fitness = fitness;
    }

}

/**
 * iterates through individual's genome and checks how many genes match target
 * returns number of matches.
 * @param {*} individual 
 * @param {*} target 
 */
function getFitness(individual, target) {
    var fitness = 0;
    var genome = individual.genome
    for (let i = 0; i < target.length; i++) {
        let chr = genome[i];
        if (chr === target[i]) {
            fitness += 1
        }
    }
    return fitness
}

/**
 * checks if individual's fitness is max
 * @param {*} individual 
 * @param {*} target 
 */
function isFittest(individual, target) {
    return individual.fitness === target.length;
}

/**
 * replaces given string's character at given index
 * @param {*} src 
 * @param {*} index 
 * @param {*} replacement 
 */
function replaceCharAt(src, index, replacement) {
    return src.substr(0, index) + replacement + src.substr(index + replacement.length);
}

/**
 * replaces given string's character at given index, incrementing by one in array list
 * @param {*} src 
 * @param {*} index 
 * @param {*} replacement 
 */
function replaceCharAtWithIncrement(src, index, replacementSpace) {
    var charAtIndex = src.charAt(index);
    var nextCharInSpace = null;
    var placeOfCharInSpace = replacementSpace.indexOf(charAtIndex);
    var nextIndexInSpace = 0;
    if (placeOfCharInSpace + 1 >= replacementSpace.length) {
        nextIndexInSpace = 0;
    } else {
        nextIndexInSpace = placeOfCharInSpace + 1;
    }
    nextCharInSpace = replacementSpace.charAt(nextIndexInSpace);
    return src.substr(0, index) + nextCharInSpace + src.substr(index + nextCharInSpace.length);
}

/**
 * replaces given string's character at given index, decrementing by one in array list
 * @param {*} src 
 * @param {*} index 
 * @param {*} replacement 
 */
function replaceCharAtWithDecrement(src, index, replacementSpace) {
    var charAtIndex = src.charAt(index);
    var nextCharInSpace = null;
    var placeOfCharInSpace = replacementSpace.indexOf(charAtIndex);
    var nextIndexInSpace = 0;
    if (placeOfCharInSpace - 1 < 0) {
        nextIndexInSpace = replacementSpace.length - 1;
    } else {
        nextIndexInSpace = placeOfCharInSpace - 1;
    }
    nextCharInSpace = replacementSpace.charAt(nextIndexInSpace);
    return src.substr(0, index) + nextCharInSpace + src.substr(index + nextCharInSpace.length);
}

/**
 * Returns an array with arrays of the given size.
 *
 * @param arr {Array} array to split
 * @param chunkSize {Integer} Size of every group
 */
function chunkArray(arr, chunkSize) {
    var arrayLength = arr.length;
    var resultArray = [];

    for (var i = 0; i < arrayLength; i += chunkSize) {
        let chunk = arr.slice(i, i + chunkSize);
        resultArray.push(chunk);
    }

    return resultArray;
}

function mutate(individual, mutationChance) {
    for (var i = 0; i < individual.genome.length; i++) {
        let chance = Math.random();
        if (chance < mutationChance) {
            individual.genome = replaceCharAt(individual.genome, i, randomChar());

            // if (rollRandomChance(50 / 100)) {
            //     individual.genome = replaceCharAtWithIncrement(individual.genome, i, characterSelection);
            // } else {
            //     individual.genome = replaceCharAtWithDecrement(individual.genome, i, characterSelection);
            // }

        }
    }
}

function pickAtLeastTwo(population, selectionPercent) {
    var result = [];
    var selectedCount = parseInt(population.length * selectionPercent);
    if (selectedCount <= 0) {
        selectedCount = 2;
    }
    for (let i = 0; i < selectedCount; i++) {
        result.push(population[i]);
    }
    return result;
}


class Simulator {
    constructor(interval = 1, resultCallback, target) {
        this.running = false;
        this.worker = null;
        this.interval = interval;
        this.resultCallback = resultCallback;

        this.geneCount = target.length;
        this.populationSize = 1000;
        this.mutationChance = 1 / 100;
        this.population = [];
        this.target = target;
        this.foundFittest = false;
        this.selectedIndividuals = []
        this.selectionPercent = 3 / 100;
        this.genomeChunkMutationChance = 50 / 100;
        this.genomeChunkSize = 5 / 100; // size of genome split into chunks for breeding purposes
    }

    _toRun(resultCallback, _this) {
        if (_this.foundFittest === false) {
            // console.log("running");
            _this.selectedIndividuals = [];
            // select x % individuals with highest fitness score
            for (var i = 0; i < _this.populationSize; i++) {
                var v = _this.population[i];
                // init individual fitness
                v.fitness = getFitness(v, _this.target);
            }
            // sort population by fitness and reverse sort
            _this.population = _this.population.sort(function (left, right) {
                var valLeft = left.fitness;
                var valRight = right.fitness;
                if (valLeft < valRight) { return -1; }
                if (valLeft > valRight) { return 1; }
                return 0;
            }).reverse();

            _this.selectedIndividuals = pickAtLeastTwo(_this.population, _this.selectionPercent);
            _this.population = _this.selectedIndividuals;
            // check if we found the fittest individual
            if (isFittest(_this.selectedIndividuals[0], _this.target)) {
                _this.foundFittest = true;
                console.log("found fittest individual")
            } else {
                // reproduce until we get pop_size again
                var currentlySelectedLen = _this.selectedIndividuals.length;
                var childrenCount = _this.populationSize - currentlySelectedLen // should be 270
                // console.log("making children ", childrenCount);
                for (let i = 0; i < childrenCount; i++) {
                    // randomly select two individuals to be parents
                    var parentOne = randomSelection(_this.selectedIndividuals);
                    var parentTwo = randomSelection(_this.selectedIndividuals);

                    var child = new Individual();

                    // chunkify parent genome and mix and match with child genome
                    var parentOneGenomeChunked = chunkArray(parentOne.genome, parentOne.genome.length * _this.genomeChunkSize);
                    var parentTwoGenomeChunked = chunkArray(parentTwo.genome, parentTwo.genome.length * _this.genomeChunkSize);
                    var genomeResult = "";
                    // iterate through genome chunks
                    for (let j = 0; j < parentOneGenomeChunked.length; j++) {
                        var parentOneChunk = parentOneGenomeChunked[j];
                        var parentTwoChunk = parentTwoGenomeChunked[j];
                        var roll = rollRandomChance(_this.genomeChunkMutationChance);
                        if (roll) {
                            // child gets genome chunk from second parent
                            genomeResult = genomeResult.concat(parentTwoChunk);
                        } else {
                            // child gets genome chunk from first parent
                            genomeResult = genomeResult.concat(parentOneChunk);
                        }
                    }
                    child.genome = genomeResult;

                    mutate(child, _this.mutationChance)

                    _this.population.push(child);

                }
            }
            // console.log("callback");
            resultCallback(_this.selectedIndividuals[0].genome, _this.foundFittest);
        } else {
            // stop sim
            _this.stopSimulation();
        }
    }

    _initPopulation() {
        console.log("init population");
        for (var i = 0; i < this.populationSize; i++) {
            var v = new Individual();
            var genome = "";
            for (var j = 0; j < this.geneCount; j++) {
                var gene = randomChar();
                genome = genome.concat(gene);
            }
            v.genome = genome;
            this.population.push(v);
        }
    }

    startSimulation() {
        if (this.foundFittest) {
            this.population = [];
            this.selectedIndividuals = [];
            this.foundFittest = false;
        }
        this.running = true;

        this._initPopulation();

        this.worker = setInterval(this._toRun, this.interval, this.resultCallback, this);
        return this.running;
    }

    stopSimulation() {
        if (this.running) {
            clearInterval(this.worker);
            this.running = false;
            return true;
        }
        return false;
    }

    isRunning() {
        return this.running;
    }
}

export { Simulator };
