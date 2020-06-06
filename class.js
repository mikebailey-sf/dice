class Player {
  constructor(number) {
    this.number = number;
    this.dice = [];
    this.total = 0;
    this.qualified = false;
    this.taken = true;
  }

  randomDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  roll() {
    if (!this.taken) {
      alert("Need to keep a dice");
      return 0;
    }
    this.taken = false;
    let numberOfDice = 6 - this.dice.length;
    let result = [];
    for (let i = 1; i <= numberOfDice; i++) {
      result.push(this.randomDice());
    }
    return result;
  }

  keep(number) {
    this.dice.push(number);
    this.taken = true;
  }

  isQualified() {
    if (this.dice.includes(1) && this.dice.includes(4)) {
      return true;
    } else {
      return false;
    }
  }

  isDone(){
    if (this.isQualified()) {
      alert ('good');
    } else {
      alert ('bad');
    }
  }
}
