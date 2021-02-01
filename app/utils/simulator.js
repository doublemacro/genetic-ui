const characterSelection = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:? ';

const GeneTypeENUM = {
    DISCRETE: 1,
    CONTINOUS: 2,
};

const GeneNameENUM = {
    CONTENT_MARGINS: 'contentMargins',
    BORDER_THICKNESS: 'borderThickness',
    JUSTIFY_ITEMS: 'justifyItems',
};

// style: {
//     contentMargins: 10, // px
//     borderThickness: 1, // px
//     justifyItems: 'start' // start, center, end, stretch
//   }

const contentMarginsGeneBlueprint = {
    name: GeneNameENUM.CONTENT_MARGINS,
    type: GeneTypeENUM.CONTINOUS,
    min: 0,
    max: 100,
}

const borderThicknessGeneBlueprint = {
    name: GeneNameENUM.BORDER_THICKNESS,
    type: GeneTypeENUM.CONTINOUS,
    min: 0,
    max: 50
}

const justifyItemsGeneBlueprint = {
    name: GeneNameENUM.JUSTIFY_ITEMS,
    type: GeneTypeENUM.DISCRETE,
    values: ['start', 'center', 'end', 'stretch']
}

/**
 * list of gene blueprints, used for random gene generation
 */
const geneSelection = [
    contentMarginsGeneBlueprint, borderThicknessGeneBlueprint, justifyItemsGeneBlueprint
];

// gene type: discrete / continous
// discrete: "start", "center", "end", "stretch"
// continous: min 0 max 100

function randomString(length) {
    var result = '';
    var characters = characterSelection;
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomGene(geneBlueprint) {
    var result = null;
    if (geneBlueprint.type === GeneTypeENUM.CONTINOUS) {
        result = {
            type: geneBlueprint.type,
            name: geneBlueprint.name,
            value: randomNumber(geneBlueprint.min, geneBlueprint.max),
        };
    } else if (geneBlueprint.type === GeneTypeENUM.DISCRETE) {
        result = {
            type: geneBlueprint.type,
            name: geneBlueprint.name,
            value: geneBlueprint.values[randomNumber(0, geneBlueprint.values.length - 1)],
        };
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
    constructor(genome = [], fitness = 0) {
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

function mutate(individual, mutationChance, geneSelection) {
    for (var i = 0; i < individual.genome.length; i++) {
        var chance = Math.random();
        if (chance < mutationChance) { // if successful chance
            individual.genome[i] = randomGene(geneSelection[i]);
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
    constructor({ interval = 10, resultCallback }) {
        this.running = false;
        this.stepCount = 0;
        this.worker = null;
        this.interval = interval;
        this.resultCallback = resultCallback;
        this.currentIndividual = null;
        this.geneCount = geneSelection.length;
        this.geneSelection = geneSelection;
        this.populationSize = 10;
        this.mutationChance = 1 / 3;
        this.population = [];
        this.foundFittest = false;
        this.selectedIndividuals = []
        this.selectionPercent = 25 / 100;
        this.genomeChunkMutationChance = 75 / 100;
        this.genomeChunkSize = 1 / geneSelection.length; // size of genome split into chunks for breeding purposes
    }

    step(val) {
        if (this.running) {
            // set individual in regards to current step
            this.currentIndividual = this.population[this.stepCount];
            // update individual with user feedback
            this.currentIndividual.fitness = val;

            this.stepCount += 1;

            if (this.stepCount === this.populationSize) {
                // if we got to the end and need to do crossover and mutation,
                // send latest style and then start again from step 0

                // reset step
                this.stepCount = 0;

                // do crossover and mutation

                this.selectedIndividuals = [];
                // select x % individuals with highest fitness score
                // sort population by fitness and reverse sort
                this.population = this.population.sort(function (left, right) {
                    var valLeft = left.fitness;
                    var valRight = right.fitness;
                    if (valLeft < valRight) { return -1; }
                    if (valLeft > valRight) { return 1; }
                    return 0;
                }).reverse();

                this.selectedIndividuals = pickAtLeastTwo(this.population, this.selectionPercent);
                this.population = this.selectedIndividuals;

                // reproduce until we get pop_size again
                var currentlySelectedLen = this.selectedIndividuals.length;
                var childrenCount = this.populationSize - currentlySelectedLen;
                // console.log("making children ", childrenCount);
                for (let i = 0; i < childrenCount; i++) {
                    // randomly select two individuals to be parents
                    var parentOne = randomSelection(this.selectedIndividuals);
                    var parentTwo = randomSelection(this.selectedIndividuals);

                    var child = new Individual();

                    // chunkify parent genome and mix and match with child genome
                    // var parentOneGenomeChunked = chunkArray(parentOne.genome, parentOne.genome.length * this.genomeChunkSize);
                    // var parentTwoGenomeChunked = chunkArray(parentTwo.genome, parentTwo.genome.length * this.genomeChunkSize);
                    var parentOneGenomeChunked = parentOne.genome;
                    var parentTwoGenomeChunked = parentTwo.genome;
                    var genomeResult = [];
                    // iterate through genome chunks
                    for (let j = 0; j < parentOneGenomeChunked.length; j++) {
                        var parentOneChunk = parentOneGenomeChunked[j];
                        var parentTwoChunk = parentTwoGenomeChunked[j];
                        var roll = rollRandomChance(this.genomeChunkMutationChance);
                        if (roll) {
                            // child gets genome chunk from second parent
                            genomeResult.push(parentTwoChunk);
                        } else {
                            // child gets genome chunk from first parent
                            genomeResult.push(parentOneChunk);
                        }
                    }
                    child.genome = genomeResult;

                    mutate(child, this.mutationChance, this.geneSelection);

                    this.population.push(child);
                } // end for
            } // end if
            // do callback

            this.currentIndividual = this.population[this.stepCount];
            var currentStyle = {};
            for (var i = 0; i < this.currentIndividual.genome.length; i++) {
                var gene = this.currentIndividual.genome[i];

                // todo: does this even work?
                currentStyle[gene.name] = gene.value;
            }

            // tell ui about current individual's style
            this.resultCallback(currentStyle, this.stepCount, this.foundFittest);
        }
    }

    _initPopulation() {
        console.log("init population");
        for (var i = 0; i < this.populationSize; i++) {
            var genome = [];
            for (var j = 0; j < this.geneSelection.length; j++) {
                var gene = randomGene(this.geneSelection[j])
                genome.push(gene);
            }
            var v = new Individual(genome, 0); // 0 fitness
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

        // get first individuals' style
        this.currentIndividual = this.population[0];
        var currentStyle = {};
        for (var i = 0; i < this.currentIndividual.genome.length; i++) {
            var gene = this.currentIndividual.genome[i];

            // todo: does this even work?
            currentStyle[gene.name] = gene.value;
        }

        // tell ui about current individual's style
        this.resultCallback(currentStyle, 0, this.foundFittest);
        return this.running;
    }

    stopSimulation() {
        if (this.running) {
            // clearInterval(this.worker);
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
