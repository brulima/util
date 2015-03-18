/**
 * Biblioteca dedicada a facilitar o uso de funções comuns
 *
 * @author Bruna Lima <bru.allima@gmail.com>
 */

/**
 * Funções Comuns
 * @namespace UtilFunc
 */
(function generateNamespace (nameSpace){
	"use strict";
	var $public = this;
	var $private = {};
	  $private.attr = {};
	  $private.version = "1";
	var $static = $public.constructor.prototype;

	/**
	 * Inicializa o namespace
	 * @memberof UtilFunc
	 * @param {string} nameSpace NameSpace a ser utilizado
	 */
	$static.init = function(nameSpace) {
		window[nameSpace] = $public;
	};

	/**
	 * Executa uma função no domReady
	 * @memberof UtilFunc
	 * @param {function} callBack Função a ser executada
	 */ 
	$public.domReady = function (callBack) {
		if ($public.validate(callBack, "function")) {
			var documentHasEventListener = document.addEventListener;

			documentHasEventListener ? 
				documentHasEventListener('DOMContentLoaded', callBack) : 
				window.attachEvent('onload', callBack);
		}	
	};

	/**
	 * Adiciona e retorna atributos ocultos
	 * @memberof UtilFunc
	 * @param {string} name Nome do atributo
	 * @param {indefinido} [value] Valor do atributo
	 * @return {indefinido} Retorna o valor do atributo quando o value for oculto
	 */ 
	$public.attribute = function (name, value) {
		if ($public.validate(name, "string")) {
			if (!value) {
				return $private.attr[name];
			} else {
				$private.attr[name] = value;
			}
		}
	};
	/**
	 * Percorre objetos e arrays
	 * @memberof UtilFunc
	 * @param {object} obj Array ou Objeto que será percorrido
	 * @param {function} callBack Função que será executada para cada ítem percorrido
	 */ 
	$public.forEach = function (obj, callback) {
		// Se o objeto estiver correto e o callback também
		if (typeof obj === "object" && typeof callback === 'function') {
			// Se for array
			if (typeof obj.length === "number") {
				// percorre todos os ítens
				for (var i = 0; i < obj.length; i++) {
					// Executa o callback
					callback(obj[i]);
				}
			// Se for objeto
			} else {
				// percorre todos os ítens
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						// Executa o callBack
						callback(key, obj);
					}
				}
			}
		} else {
			throw new $public.error("[forEach]", "invalid argument");
		}
	};

	/**
	 * Valida tipos de variável
	 * @memberof UtilFunc
	 * @namespace Validate
	 * @method validate
	 * @param {object} attributes Array contendo objetos de atributos no formato {attr: attr, type: type}
	 * @return {boolean} Atributos corretos ou não
	 * @param {indefinido} attributes Atributos não arrays necessitam de um segundo parâmetro sempre
	 * @param {string} [type] Tipo esperado
	 * @return {boolean} Se o atributo for do tipo esperado
	 * @return {string} Se o parâmetro type não for preenchido
	 */ 
	$public.validate = function (attributes, type) {
		/**
		 * Valida o tipo quando o atributo vem em array
		 * @memberof UtilFunc.Validate
		 * @param {object} obj Objeto contendo as informações necessárias
		 */ 
		var validateType = function (obj) {
			if (typeof obj.attr !== obj.type) {
				throw new $public.error("[validate]", "argument is not a " + obj.type);
			}
		};

		/////////////// Início da função
		try {
			// Se o atributo não vier como object
			if (typeof attributes !== "object") {
				// E não possuir o type
				if (!type) {
					// Retornar o typeof
					return typeof attributes;
				// Se possuir o type, porém o atributo for diferente
				} else if (typeof attributes !== type) { 
					// Gerar erro
					throw new $public.error("[validate]", "argument is not a " + type);
				}
			// Se o atributo vier como object (array)
			} else {
				// percorrer a validar caso a caso
				$public.forEach(attributes, validateType);
			}
			return true;
		} catch (e) {
			throw e;
		}
	};

	/**
	 * Cria um erro
	 * @memberof UtilFunc
	 * @param {string} name Nome do erro
	 * @param {string} [message] Mensagem do erro
	 */ 
	$public.error = function (name, message) {
		this.prototype = new Error();
		this.name = name;
		this.message = message;
	};

	/**
	 * Faz uma chamada Ajax para o NodeJS
	 * @memberof UtilFunc
	 * @namespace AjaxFunction
	 * @method ajaxScript
	 * @param {string} command Comando para o NodeJS
	 * @param {object} [params] Parâmetros necessários
	 */ 
	$public.ajaxScript = function (command, params) {

		/**
		 * Valida os argumentos
		 * @memberof UtilFunc.AjaxFunction
		 * @param {string} command Comando para o NodeJS
		 * @param {object} [params] Parâmetros necessários
		 * @return {boolean} Se os parâmetros são válidos
		 */ 
		var valideType = function (command, params) {
			var bool = params ? $public.validate(params, "object") : true;
			return $public.validate(command,"string") && bool;
		};

		/**
		 * Retorna a queryString da URL
		 * @memberof UtilFunc.AjaxFunction
		 * @namespace GetQuery
		 * @method getQuery
		 * @param {object} [params] Parâmetros necessários
		 * @return {string} Query com os parâmetros e um random
		 */ 
		var getQuery = function (params) {
			
			/**
			 * Adiciona os parâmetros à queryString 
			 * @memberof UtilFunc.AjaxFunction.GetQuery
			 * @param {string} param Nome do parâmetro
			 * @param {object} params Objeto com todos os parâmetros
			 * @return {string} Query com os parâmetros e um random
			 */ 
			var addParam = function (param, params) {
				query += param + "=" + encodeURIComponent(params[param]) + "&";
			};

			/////////////// Início da função
			var query = "?";

			// Adiciona os parâmetros no script
			forEach(params, addParam);
			
			// Adicionar um random para limpar o cache
			query += Math.random();

			return query;
		};

		/**
		 * Remove o script que foi criado
		 * @memberof UtilFunc.AjaxFunction
		 */ 
		var removeScript = function () {
			var bdy = document.getElementsByTagName('body')[0];
			bdy.removeChild(scp);
		};

		
		/////////////// Início da função
		var scp;
		params = params || {}; 

		if (valideType(command, params)) {
			
			// Cria o src
			var query = getQuery(params);
			var src = "/ajax/" + command + ".js" + query;

			// Cria e adiciona o script
			scp = $public.addScript(src);
		
			// Remove o script
			setTimeout(removeScript, 2000);
		}
		
	};

	/**
	 * Adiciona um javaScript na página
	 * @memberof UtilFunc
	 * @param {string} src Source do script
	 * @return {HTMLElement} Script gerado
	 */ 
	$public.addScript = function (src) {

		// Cria o script
		var scp = document.createElement('script');
		scp.src = src;
		scp.type = "text/javascript";
		scp.async = true;

		// Adiciona ao body
		var bdy = document.getElementsByTagName('body')[0];
		bdy.appendChild(scp);

		return scp;
	};

	return $static.init(nameSpace);
}("util"));
