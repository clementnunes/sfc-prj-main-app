import {SecurityConfig} from "../config/security.config";

export class Entropy {
    private length : number;
    private alphabet : Array<string>;
    private strength : number;
    private password : string;

    constructor(password: string) {
        this.password = password;
        this.length = password.length;
        this.alphabet = [];
        this.strength = 0;
        this.extractAlphabet();
        this.processStrength();
    }

    private extractAlphabet()
    {
        this.alphabet = this.password.split("").filter(
            (symbol, index) => this.password.indexOf(symbol) === index
        )
    }

    private getAlphabetSize()
    {
        return this.alphabet.length;
    }

    private processStrength()
    {
        const strengthPerChar = Math.log2(this.getAlphabetSize());
        this.strength = Math.round(strengthPerChar * this.length);
    }

    private validate()
    {
        return this.strength >= SecurityConfig.MIN_ENTROPY;
    }
}