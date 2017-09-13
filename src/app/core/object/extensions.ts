///<reference path="extensions.d.ts"/>

Object.isEmpty = function(obj: object): boolean {
    return Object.keys(obj).length === 0;
}