// let text = "PIFFM MQI'YR J PQM DJR J PXA ZQXVR NGJMXZ' XZ THR VTYRRT AQZZJ PR J PXA DJZ VQDR FJM MQI AQT DIF QZ MQ' SJOR MQI PXA FXVAYJOR XOXZ' MQIY OJZ JGG QLRY THR NGJOR VXZAXZ'"
// GUIDE USED: https://cryptograms.puzzlebaron.com/tutorial.php
let text = "PIFFMKMQI'YRKJKPQMKDJ RKJKPXAKZQXVRKNGJMXZ'KXZKTHRKVTYRRTKAQZZJKPRKJKPXAKDJZKVQDRKFJMKMQIKAQTKDIFKQZKMQ'KSJORKMQIKPXAKFXVAYJORK XO XZ'KMQIYKOJZKJGGKQLRYKTHRKNGJORKVXZAXZ'"
// we want to decrypt the text using frequency analysis, ignoring spaces and punctuation
text = text.replaceAll(" ", "_")

let alphabet = "abcdefghijklmnopqrstuvwxyz'"
// gqzcxdlhuasvypmboewtjfkirn

let oneLetters = ["a", "i"]
let twoLetters = [
    "of", "to", "in", "it", "is", "be", "as", "at", "so", "we", 
  "he", "by", "or", "on", "do", "if", "me", "my", "up", "an", 
  "go", "no", "us", "am"
];

let threeLetters = [
    "the", "and", "for", "are", "but", "not", "you", "all", 
  "any", "can", "had", "her", "was", "one", "our", "out", 
  "day", "get", "has", "him", "his", "how", "man"
]

let fourLetters = [
    "that", "with", "have", "this", "will", "your", "from", "they", 
  "know", "want", "been", "good", "much", "some", "time", "very", 
  "when", "come", "here", "just", "like", "long", "make", "many", 
  "more", "only", "over", "such", "take", "than", "them", "well", 
  "were"
]

let doubledLetters = [
    'ee', 'll', 'ss',
    'oo', 'tt', 'ff',
    'rr', 'nn', 'pp',
    'cc'
]

let contraction = ["re", "ve", "ll"]

// let mapping = { "J": "a", "R": "e", "X": "i", "Z": "n", "G": "l", "Q": "o", "T": "t", "H": "h", "M": "y", "I": "u", "Y": "r", "L": "v", "F": "d", "O": "c", "V": "s", "D": "m", "P": "b", "A": "g", "N": "p" }
let mapping = {}

function findFrequency() {
    let frequency = {}
    // count the frequency of each letter
    for(let i in text) {
        let letter = text[i]
        if(frequency[letter]) {
            frequency[letter]++
        }
        else {
            frequency[letter] = 1
        }
    }
    // calculate the percentage of each letter
    for(let i in frequency) {
        frequency[i] = (frequency[i] / text.length) * 100
    }
    // sort the letters by frequency in descending order and print them with their percentage
    let sortedFrequency = Object.entries(frequency).sort((a, b) => b[1] - a[1])
    // console.log(sortedFrequency)
    console.log("Assignig K --> space")
    console.log("Assigning space --> k")
    mapping["_"] = "k"
    mapping["K"] = " "
    updateText()
}

function findOneLetterWords() {
    let possibleSolutions = []
    for(let i in oneLetters) {
        let possibleSolution = ""
        let words = text.split(" ")
        for(let j in words) {
            let word = words[j]
            let newWord = ""
            if(word.length === 1) {
                newWord = oneLetters[i]
            } else {
                newWord = word
            }
            possibleSolution += newWord + " "
        }
        possibleSolutions.push(possibleSolution)
    }
    console.log(possibleSolutions)
    console.log("Assigning J --> a")
    mapping["J"] = "a"
    updateText()
}

function findContraction() {
    let possibleSolutions = []
    for(let i in contraction) {
        let possibleSolution = text
        let words = text.split(" ")
        for(let j in words) {
            let word = words[j]
            if(word.endsWith("'YR")) {
                let lastTwoLetters = word.slice(-2).split("")
                let contractionLetters = contraction[i].split("")
                possibleSolution = possibleSolution.replaceAll(lastTwoLetters[0], contractionLetters[0])
                possibleSolution = possibleSolution.replaceAll(lastTwoLetters[1], contractionLetters[1])
                possibleSolutions.push(possibleSolution)
                break
            }
        }
    }
    console.log(possibleSolutions)
    console.log("Assigning R --> e")
    // console.log("Assigning X --> i")
    // console.log("Assigning Z --> n")
    console.log("Assigning Y --> r")
    // console.log("Assigning L --> v")
    // mapping = { ...mapping, "R": "e", "X": "i", "Z": "n", "Y": "r", "L": "v" }
    mapping["R"] = "e"
    mapping["Y"] = "r"
    updateText()
}

function findDoubledLetters() {
    // for each word, find the doubled letters and substitute them in the whole text
    let possibleSolutions = []
    // remove the letters that we already know
    let alreadyKnownLetters = Object.values(mapping)
    doubledLetters = doubledLetters.filter(word => word.split("").every(letter => !alreadyKnownLetters.includes(letter)))

    for(let i in doubledLetters) {
        let possibleSolution = text
        let words = text.split(" ")
        for(let j in words) {
            let word = words[j]
            let lastLetter = ""
            for(let k in word) {
                let letter = word[k]
                if(letter === lastLetter && !alphabet.includes(letter)) {
                    // we have a doubled letter, substitute it everywhere in the text
                    possibleSolution = possibleSolution.replaceAll(letter, doubledLetters[i].split("")[0])
                    possibleSolutions.push(possibleSolution)
                    break
                }
                lastLetter = letter
            }
        }
    }
    console.log(possibleSolutions)
    console.log("Assigning G --> l")
    mapping["G"] = "l"
    updateText()
    return possibleSolutions
}

function findTwoLetterWords() {
    let possibleSolutions = []

    for(let i in twoLetters) {
        let possibleSolution = text
        let words = text.split(" ")
        for(let j in words) {
            let word = words[j]
            if(word.length === 2) {
                // if the word contains a letter that we already know, twoLetters[i] must contain that letter at the same index
                for(let k in word) {
                    if(Object.values(mapping).includes(word[k])) {
                        if(twoLetters[i].split("")[k] !== word[k]) {
                            break
                        }
                    }

                    // if twoLetters[i] contains a letter that we already know, the word must contain that letter at the same index
                    if(Object.values(mapping).includes(twoLetters[i].split("")[k])) {
                        if(word[k] !== twoLetters[i].split("")[k]) {
                            break
                        }
                    }

                    // if we reached the end, we can substitute the word
                    if(k == word.length - 1) {
                        let twoLettersArray = twoLetters[i].split("")
                        let wordArray = word.split("")
                        possibleSolution = possibleSolution.replaceAll(wordArray[0], twoLettersArray[0])
                        possibleSolution = possibleSolution.replaceAll(wordArray[1], twoLettersArray[1])
                        possibleSolutions.push(possibleSolution)
                    }
                }
            }
        }
    }
    console.log(possibleSolutions)
    console.log("Assigning X --> i")
    console.log("Assigning Z --> n")
    console.log("Assigning P --> b")
    mapping["X"] = "i"
    mapping["Z"] = "n"
    mapping["P"] = "b"
    updateText()
}

function findThreeLetterWords() {
    let possibleSolutions = []
    for(let i in threeLetters) {
        let possibleSolution = text
        let words = text.split(" ")
        for(let j in words) {
            let word = words[j]
            if(word.length === 3 && !word.includes("'") && word != word.toLowerCase()) {
                // if the word contains a letter that we already know, threeLetters[i] must contain that letter at the same index
                let isValid = true
                for(let k in word) {
                    if(Object.values(mapping).includes(word[k])) {
                        if(threeLetters[i].split("")[k] !== word[k]) {
                            isValid = false
                            break
                        }
                    }
                    if(Object.values(mapping).includes(threeLetters[i].split("")[k])) {
                        if(word[k] !== threeLetters[i].split("")[k]) {
                            isValid = false
                            break
                        }
                    }
                }
                if(!isValid) {
                    continue
                }
                let threeLettersArray = threeLetters[i].split("")
                let wordArray = word.split("")
                possibleSolution = possibleSolution.replaceAll(wordArray[0], threeLettersArray[0])
                possibleSolution = possibleSolution.replaceAll(wordArray[1], threeLettersArray[1])
                possibleSolution = possibleSolution.replaceAll(wordArray[2], threeLettersArray[2])
                possibleSolutions.push(possibleSolution)
            }
        }
    }
    console.log(possibleSolutions)
    console.log("Assigning T --> t")
    console.log("Assigning H --> h")
    console.log("Assigning F --> d")
    console.log("Assigning O --> c")
    mapping["T"] = "t"
    mapping["H"] = "h"
    mapping["F"] = "d"
    mapping["O"] = "c"
    updateText()
}

function findFourLetterWords() {
    let possibleSolutions = []
    for(let i in fourLetters) {
        let possibleSolution = text
        let words = text.split(" ")
        for(let j in words) {
            let word = words[j]
            if(word.length === 4 && !word.includes("'") && word != word.toLowerCase()) {
                // if the word contains a letter that we already know, fourLetters[i] must contain that letter at the same index
                let isValid = true
                for(let k in word) {
                    if(Object.values(mapping).includes(word[k])) {
                        if(fourLetters[i].split("")[k] !== word[k]) {
                            isValid = false
                            break
                        }
                    }
                    if(Object.values(mapping).includes(fourLetters[i].split("")[k])) {
                        if(word[k] !== fourLetters[i].split("")[k]) {
                            isValid = false
                            break
                        }
                    }
                }
                if(!isValid) {
                    continue
                }
                let fourLettersArray = fourLetters[i].split("")
                let wordArray = word.split("")
                possibleSolution = possibleSolution.replaceAll(wordArray[0], fourLettersArray[0])
                possibleSolution = possibleSolution.replaceAll(wordArray[1], fourLettersArray[1])
                possibleSolution = possibleSolution.replaceAll(wordArray[2], fourLettersArray[2])
                possibleSolution = possibleSolution.replaceAll(wordArray[3], fourLettersArray[3])
                possibleSolutions.push(possibleSolution)
            }
        }
    }
    console.log(possibleSolutions)
    console.log("Assigning M --> y")
    console.log("Assigning I --> u")
    console.log("Assigning V --> s")
    console.log("Assigning D --> m")
    console.log("Assigning Q --> o")
    mapping["M"] = "y"
    mapping["I"] = "u"
    mapping["Q"] = "o"
    mapping["D"] = "m"
    mapping["V"] = "s"
    updateText()
}

function findMissingLetters() {
    let possibleSolutions = []
    let missingLetters = alphabet.split("").filter(letter => !Object.values(mapping).includes(letter) && letter != "'")
    console.log("Missing letters: ", missingLetters)
    // for each word with an UPPERCASE letter, substitute the letter with a missing letter
    for(let i in missingLetters) {
        let possibleSolution = text
        let words = text.split(" ")
        for(let j in words) {
            let word = words[j]
            if(word != word.toLowerCase()) {
                let uppercaseLetter = word.split("").filter(letter => letter != letter.toLowerCase())[0]
                possibleSolution = possibleSolution.replaceAll(uppercaseLetter, missingLetters[i])
                possibleSolutions.push(possibleSolution)
            }
        }
    }
    console.log(possibleSolutions)
    console.log("Assigning L --> v")
    console.log("Assigning N --> p")
    console.log("Assigning A --> g")
    mapping["L"] = "v"
    mapping["N"] = "p"
    mapping["A"] = "g"
    updateText()
}

function updateText() {
    for(let i in mapping) {
        text = text.replaceAll(i, mapping[i])
    }
    console.log("New mapping: ", JSON.stringify(mapping))
    console.log("New text:\n", text)
}

function decrypt() {
    console.log(text)
    findFrequency()
    findOneLetterWords()
    findContraction()
    findDoubledLetters()
    findFourLetterWords()
    findThreeLetterWords()
    findTwoLetterWords()
    findMissingLetters()
}

decrypt()