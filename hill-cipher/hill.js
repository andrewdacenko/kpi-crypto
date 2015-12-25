'use strict';

var COLOR_SCHEME = require('./color_scheme');
var dictionary = require('./dictionary');
var Matrix = require('matrixmath/Matrix');
var rli;

class Hill {
    constructor(isDecryptMode, key, rl) {
        Hill.validateKey(key);

        this.key = key;
        this.dimension = Math.sqrt(this.key.length);
        this.isDecryptMode = isDecryptMode;
        this.generateMatrices();
        rli = rl;
    }

    process(msg) {
        if (Hill.hasInvalidLetters(msg)) {
            console.log(COLOR_SCHEME.error('Message has incorrect input!'));
        }

        if (msg.length % this.dimension !== 0) {
            var rest = this.dimension - msg.length % this.dimension;
            msg += new Array(rest).fill().map(Hill.getRandomLetter).join('');
        }

        let computedMessage = this.getComputedMessage(msg);

        console.log(COLOR_SCHEME.success(computedMessage));

        rli.prompt(true);
    }

    static getRandomLetter() {
        const randomInt = ~~(Math.random() * dictionary.length);
        return Hill.toLetter(randomInt);
    }

    getComputedMessage(msg) {
        let computed = '';

        while (msg.length) {
            computed += this.getMessage(msg.substr(0, 3));
            msg = msg.substr(3);
        }

        return computed;
    }

    getMessage(msg) {
        let vector = new Matrix(this.dimension, 1)
            .setData([].slice.call(msg).map(Hill.getLetterIndex));

        let matrix = this.isDecryptMode ? this.decryptMatrix : this.encryptMatrix;
        return matrix
            .clone()
            .multiply(vector)
            .toArray()
            .map(i => i % dictionary.length)
            .map(Hill.toLetter)
            .join('');
    }

    generateMatrices() {
        this.encryptMatrix = new Matrix(this.dimension, this.dimension)
            .setData([].slice.call(this.key).map(Hill.getLetterIndex));

        let modularMultiplicativeInverse = calculateMMI(this.encryptMatrix.getDeterminant());

        let decodeMatrix = this.encryptMatrix
            .clone()
            .invert()
            .multiply(this.encryptMatrix.getDeterminant())
            .multiply(modularMultiplicativeInverse)
            .toArray()
            .map(i => (
                    i % dictionary.length < 0
                        ? dictionary.length + i % dictionary.length
                        : i % dictionary.length
                ).toFixed(0)
            );

        this.decryptMatrix = new Matrix(this.dimension, this.dimension).setData(decodeMatrix);

        console.log('\x1B[32mEncrypt: ', this.encryptMatrix.toArray().map(Hill.toLetter).join(''));
        console.log('Decrypt: ', this.decryptMatrix.toArray().map(Hill.toLetter).join(''));

        function calculateMMI(determinant) {
            for (let mmi = 1; mmi < dictionary.length; mmi++) {
                if (mmi * determinant % dictionary.length === 1) {
                    return mmi;
                }
            }

            throw new Error('modular multiplicative inverse is not found!');
        }
    }

    static validateKey(key) {
        if (!key || !Number.isInteger(Math.sqrt(key.length)) || Hill.hasInvalidLetters(key)) {
            console.log('Key is not valid!');
            process.exit(1);
        }
    }

    static getLetterIndex(l) {
        return dictionary.indexOf(l.toUpperCase());
    }

    static toLetter(i) {
        return dictionary[i];
    }

    static hasInvalidLetters(key) {
        for (let l of key) {
            if (Hill.getLetterIndex(l) === -1) {
                return true;
            }
        }

        return false;
    }
}

module.exports = Hill;
