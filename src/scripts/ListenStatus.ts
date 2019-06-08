export class ListenStatus {

  constructor(public onChange: (this: ListenStatus) => void) {

  }

  private _active = true

  public set active(value: boolean) {
    this._active = value
    this.onChange()
  }

  public get active() {
    return this._active
  }
}