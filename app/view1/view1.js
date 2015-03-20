//'use strict';

angular.module('myApp.view1', ['ngRoute', 'ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when('/view1', {
                templateUrl: 'view1/view1.html',
                controller: 'View1Ctrl'
            })
            .when('/detail/:cpf', {
                controller: 'DetailCtrl',
                templateUrl: 'view1/detail.html'
            });
    }])

    .factory('Pessoas', function () {
        var Pessoas = {};
        Pessoas.cast = [
            {
                nome: "josé rocha do carmo",
                login_unico: "joserocha",
                emails: ["tom.jrc@gmail.com", "tom.jrc1@gmail.com"],
                cpf: 1161061150,
                id: 1
            },
            {nome: "pablo leonardo", login_unico: "pablo", emails: {email: "pablo@gmail.com"}, cpf: 1161061150, id: 2},
            {
                nome: "ricardo borges",
                login_unico: "ricardo",
                emails: {email: "ricardo@gmail.com"},
                cpf: 1161061150,
                id: 3
            },
            {nome: "maria da penha", login_unico: "maria", emails: {email: ""}, cpf: 1161061151, id: 4},
            {nome: "frodo bolseiro", login_unico: "frodo", emails: {email: "frodo@gmail.com"}, cpf: 1161061150, id: 6},
            {nome: "bilbo bolseiro", login_unico: "bilbo", emails: {email: "bilbo@gmail.com"}, cpf: 1161061150, id: 7}
        ];
        return Pessoas;
    }
)

    .controller('View1Ctrl', function ($scope, Pessoas, $modal) {
        console.log("View1Ctrl - search:" + search.value);
        $scope.pessoas = Pessoas;

        $scope.findByType = function (search) {
            var type = '';

            if (!search)
                return "...";

            switch (defineType(search)) {
                case "email":
                    type = "e-mail: ";
                    break;
                case "nome":
                    type = "nome: ";
                    break;
                case "loginunico":
                    type = "login único: ";
                    break;
                case "cpf":
                    type = "cpf: ";
                    break;
                case "cd_pessoa":
                    type = "identificador pessoa: ";
                    break;
            }
            return type + search;
        }

        $scope.open = function (size,cpf) {
            var modalInstance = $modal.open({
                templateUrl: 'view1/detail.html',
                controller: 'DetailCtrl',
                size: size,
                resolve: {
                    cpf: function () {
                        return cpf;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            });
        };


    })

    .controller('DetailCtrl', function ($scope, $modalInstance, cpf) {
        console.log("cpf:" + cpf);
        $scope.cpf=cpf;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });

var defineType = function (search) {
    if (isNaN(search)) {
        if (isEmail(search))
            return "email";
        else if (isNome(search))
            return "nome";
        else
            return "loginunico";
    }
    else {
        if (validarCPF(search))
            return "cpf";
        else
            return "cd_pessoa";
    }
    console.log("returning void..." + search)
    return '';
}

function isEmail(email) {
    return email.indexOf("@") != -1;

}

function isNome(nome) {
    return (
    nome.indexOf(" ") != -1
    );
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;
    // Elimina CPFs invalidos conhecidos   

    cpf = cpf.lpad('0', 11);
    //console.log(cpf);
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    // Valida 1o digito
    add = 0;
    for (i = 0; i < 9; i++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

//pads left
String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}