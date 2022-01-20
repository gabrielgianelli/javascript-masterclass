// 1
// function fn1() {
//     const v1 = 10;
//     return function () {
//         console.log(v1);
//     }
// }
// const fn2 = fn1();
// const v1 = 100;
// fn2();

// 2
// const v1 = 10
// function fn1() {
//     console.log(v1);
// }
// function fn2(fn1) {
//     const v1 = 100;
//     fn1();
// }
// fn2(fn1);

// 3
// function fn1() {
//     let v1 = 10;
//     return {
//         m1() {
//             console.log(++v1);
//         },
//         m2() {
//             console.log(--v1);
//         }
//     }
// }
// const obj1 = fn1();
// obj1.m1();
// obj1.m2();

// 4
// const obj1 = {}
// for (var v1 = 0; v1 < 3; v1++) {
//     obj1[v1] = function () {
//         console.log(v1);
//     }
// }
// obj1[0]();
// obj1[1]();
// obj1[2]();

// // 5 
// const obj1 = {}
// for (var v1 = 0; v1 < 3; v1++) {
//     obj1[v1] = (function (v2) {
//         return function () {
//             console.log(v2);
//         };
//     })(v1);
// }
// obj1[0]();
// obj1[1]();
// obj1[2]();

// 6 
// const obj1 = {}
// for (var v1 = 0; v1 < 3; v1++) {
//     obj1[v1] = (function () {
//         console.log(this.v2);
//     }).bind({v2: v1});
// }
// obj1[0]();
// obj1[1]();
// obj1[2]();
