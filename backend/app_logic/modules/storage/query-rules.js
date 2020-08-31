/*
  These rules validate incoming parameters and return storage-compatible pieces for query.
  Each of them has isValid() and toQueryPart() methods as well as ctor that take actual value to validate
*/

class SingleValueRule {

  constructor(value, allowedValues) {
    this._value = value;
    this._allowedValues = allowedValues;
  }
  isValid() {
    return this._allowedValues.indexOf(this._value) >= 0
  }
  toQueryPart () {
    return this._value
  }
}

class BooleanValueRule {

  constructor(value) {
    this._value = value;
  }
  isValid() {
    return this._value === 'true' || this._value === 'false'
  }
  toQueryPart () {
    return this._value === 'true'
  }
}

/// Validate if incoming VALUE is as string and convert it to '$in array' query, by splitting VALUE by ','
class ArrayRule {

  constructor(value) {
    this._value = value;
  }
  isValid() {
    return typeof (this._value) === 'string'
  }
  toQueryPart () {
    return { $in: this._value.split( ',' ).filter(Boolean) }
  }
}

/// Validate if incoming VALUE is as string of format YYYY-MM-DD and convert it to 'greater than VALUE' query
class SinceDateRule {

  constructor(value) {
    this._value = value;
  }
  isValid() {
    return typeof (this._value) === 'string' && /\d\d\d\d-\d\d-\d\d/.test(this._value)
  }
  toQueryPart () {
    return { $gte: this._value }
  }
}
class BeforeDateRule {

  constructor(value) {
    this._value = value;
  }
  isValid() {
    return typeof (this._value) === 'string' && /\d\d\d\d-\d\d-\d\d/.test(this._value)
  }
  toQueryPart () {
    return { $lt: this._value }
  }
}

module.exports = {
  SingleValueRule,
  ArrayRule,
  SinceDateRule,
  BeforeDateRule,
  BooleanValueRule
}
