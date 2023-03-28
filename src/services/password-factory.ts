import {randomBytes} from "crypto";

export default class PasswordFactory {
    private static supportedChars = ["-", "_", "/", "$", "&", "*", "(", ")", "@", "#", "?", "!", ",", "|", "=", "+", ".", ":"];
    private static regExp = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[_$&*()@#\\?!,|=+.:-])[A-Za-z\\d_$&*()@#\\?!,|=+.:-]{1,}$/";

    static bin2hex(s: string) {
        let i
        let l
        let o = ''
        let n
        s += ''
        for (i = 0, l = s.length; i < l; i++) {
            n = s.charCodeAt(i)
                .toString(16)
            o += n.length < 2 ? '0' + n : n
        }
        return o
    }

    static randomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    private static generateRandomPhrase() {
        const bytes = randomBytes(12);
        const hexPhrase = bytes.toString("hex")
        const randomInt = PasswordFactory.randomInt(0, PasswordFactory.supportedChars.length - 1);
        const hexPhraseSize = hexPhrase.length;

        return hexPhrase.substring(0, hexPhraseSize / 2)
            + PasswordFactory.supportedChars[randomInt]
            + hexPhrase.substring(hexPhraseSize / 2, hexPhraseSize - 1);
    }

    private static validityStamp() {
        const today = new Date();
        return `==Ad.${today.getUTCDate()}-${today.getUTCMonth()}`;
    }

    public generate() {
        return PasswordFactory.generateRandomPhrase() + PasswordFactory.validityStamp();
    }
}