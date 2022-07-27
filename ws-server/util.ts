const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateRoomCode(numCharacters: number): string {

    var roomCode = "";

    for(var i = 0; i < numCharacters; i++) {
        var randomNum = Math.round(Math.random() * 25);
        var randomLetter = letters.charAt(randomNum);
        roomCode = roomCode + randomLetter;
    }

    return roomCode;
}

export interface message {
    type: string;
    message: string;
}