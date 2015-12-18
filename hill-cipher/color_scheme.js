var COLOR_SCHEME = {
    RESET: '\x1B[39m',
    ANSWER: '\x1B[36m', // NYAN
    ERROR: '\x1B[31m', // RED
    SUCCESS: '\x1B[35m', // GREEN
    INFO: '\x1B[1m', // BOLD,
    error: function(str) {
        return this.ERROR + str + this.RESET;
    },
    info: function(str) {
        return this.INFO + str + '\x1B[22m';
    },
    success: function(str) {
        return this.SUCCESS + str + this.RESET;
    }
};

module.exports = COLOR_SCHEME;