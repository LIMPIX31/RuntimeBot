export enum AssocEnum {
  ERROR,
  IDLE,
  SUCCESS
}

const RankAssoc: any = {
  '-1': AssocEnum.ERROR,
  '0': AssocEnum.IDLE,
  '1': AssocEnum.SUCCESS
}

export class StageSnapshot<T> {

  private readonly _rank: number = 0
  private readonly _stage: T

  constructor(stageRanker: StageRanker<T>) {
    this._rank = stageRanker.rank
    this._stage = stageRanker.stage
  }

  get rank(): number {
    return this._rank
  }

  get stage(): T {
    return this._stage
  }

  get emoji() {
    return StageRankEmoji[this._rank + '']
  }

  getAssoc(assoc = RankAssoc) {
    return assoc[this._rank + '']
  }

}

export class StageRanker<T = string> {
  private rankRange: number[] = [-1, 1]

  constructor(stage: T) {
    this._stage = stage
  }

  private _rank: number = 0

  get rank(): number {
    return this._rank
  }

  set rank(rank: number) {
    (rank >= this.rankRange[0] && rank <= this.rankRange[1]) && (this._rank = rank)
  }

  private _history: StageSnapshot<T>[] = []

  get history(): StageSnapshot<T>[] {
    const actualHistory = [...this._history]
    actualHistory.push(new StageSnapshot<T>(this))
    return actualHistory
  }

  private _stage: T

  get stage(): T {
    return this._stage
  }

  set setRankRange(range: number[]) {
    this.rankRange = range
  }

  get emoji() {
    return StageRankEmoji[this._rank + '']
  }

  getAssoc(assoc = RankAssoc) {
    return assoc[this._rank + '']
  }

  up() {
    this._rank + 1 <= this.rankRange[1] && this._rank++
  }

  down() {
    this._rank - 1 >= this.rankRange[0] && this._rank--
  }

  top() {
    this._rank = this.rankRange[1]
  }

  crash() {
    this._rank = this.rankRange[0]
  }

  updateStage(newStage: T, topOnUpdate: boolean = true, resetRank = true, resetTo = 0) {
    topOnUpdate && this.top()
    this._history.push(new StageSnapshot<T>(this))
    this._stage = newStage
    resetRank && (this._rank = resetTo)
  }

}

export const StageRankEmoji: any = {
  '-1': '❌',
  '0': '⚫',
  '1': '✅'
}
