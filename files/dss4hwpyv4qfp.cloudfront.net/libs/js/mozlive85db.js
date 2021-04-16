/* MozLive 3 */

function mozLive3(settings)
{
    var defaults = {
        source: null,         // Source object (id, name, global, superglobal).
        action: '',           // Component-specific action to execute.
        parameters: {},       // Additional action-specific parameters.
        response: {
            callback: [],     // Callbacks to execute on the response.
            append: [],       // Objects to append with the response.
            replace: [],      // Objects to replace with the response.
            html: [],         // Objects to replace the HTML with the response.
            redirect: null,   // Redirect to perform (URL, @response, @refresh).
        },
        errors: {
            maintenance: 'We can not process your request right now. Please try again later.'
        }
    };

    this.options = $.extend(true, {}, this.defaults, settings);
    this.run();
};

mozLive3.prototype.resolveObject = function(definitions)
{
    var base = this,
        resolved = null;

    if (definitions == '@self') {
        definitions = base.options.source;
    }

    if (typeof definitions.id !== 'undefined') {
        resolved = $('[data-cid="' + definitions.id + '"]');
    }
    else if (typeof definitions.name !== 'undefined') {
        resolved = $('[data-name="' + definitions.name + '"]');
    }
    else if (typeof definitions.jquery !== 'undefined') {
        resolved = $(definitions.jquery);
    }

    return resolved;
};

mozLive3.prototype.respond = function(mozResult) {

    var base = this;

    // Runs callbacks.

    if ($.isArray(base.options.response.callback)) {
        base.options.response.callback.forEach(function(value, index) {
            value(mozResult);
        });
    }

    // Runs append tasks.

    if ($.isArray(base.options.response.append)) {
        base.options.response.append.forEach(function(value, index) {
            var obj = base.resolveObject(value);
            if (obj) {
                obj.append(mozResult);
            }
        });
    }

    // Runs replace tasks.

    if ($.isArray(base.options.response.replace)) {
        base.options.response.replace.forEach(function(value, index) {
            var obj = base.resolveObject(value);
            if (obj) {
                if (typeof value.target == 'string') {
                    obj.find(value.target).replaceWith(mozResult);
                }
                else {
                    obj.replaceWith(mozResult);
                }
            }
        });
    }

    // Runs replace HTML tasks.

    if ($.isArray(base.options.response.html)) {
        base.options.response.html.forEach(function(value, index) {
            var obj = base.resolveObject(value);
            if (obj) {
                if (typeof value.target == 'string') {
                    obj.find(value.target).html(mozResult);
                }
                else {
                    obj.html(mozResult);
                }
            }
        });
    }

    // Runs redirect tasks.

    if (typeof base.options.response.redirect == 'string') {
        var redirectTo = '';
        switch (base.options.response.redirect) {
            case '@response':
                redirectTo = mozResult;
                break;
            case '@refresh':
                redirectTo = '/m/refresh/';
                break;
            default:
                redirectTo = base.options.response.redirect;
                break;
        }
        window.location.href = redirectTo;
    }
};

mozLive3.prototype.run = function()
{
    var base = this;

    $.ajax({
        url: '/m/mozlive/' + base.options.action + '/',
        type: 'post',
        data: {
            src: base.options.source,
            action: base.options.action,
            parameters: base.options.parameters,
            url: window.location.pathname
        },
        success: function(response) {
            if (response.error == true) {
                if (response.reason == 'maintenance') {
                    alert(base.options.errors.maintenance);
                }
            }
            else {
                base.respond(response);
                if (typeof base.options.onComplete == 'function') {
                    base.options.onComplete(response);
                }
            }
        }
    });
};

/* MozLive 2 */

function mozLive2(settings)
{
    var base = this;

    /**
     * Default settings.
     */
    this.defaults = {
        source: null,         // Source object (id, name, global, superglobal).
        action: '',           // Component-specific action to execute.
        parameters: {},       // Additional action-specific parameters.
        response: {
            callback: [],     // Callbacks to execute on the response.
            append: [],       // Objects to append with the response.
            replace: [],      // Objects to replace with the response.
            html: [],         // Objects to replace the HTML only.
            redirect: null,   // Redirect to perform (URL, @response, @refresh).
        },
        errors: {
            maintenance: 'We can not process your request right now. Please try again later.'
        }
    };

    /**
     * Resolves a jQuery object from definitions (source, response.append, response.replace).
     */
    this.resolveObject = function(definitions) {

        var resolved = null;

        if (definitions == '@self') {
            definitions = base.options.source;
        }

        if (typeof definitions.id !== 'undefined') {
            resolved = $('[data-cid="' + definitions.id + '"]');
        }
        else if (typeof definitions.name !== 'undefined') {
            resolved = $('[data-name="' + definitions.name + '"]');
        }

        return resolved;
    };

    /**
     * Executes the MozLive function.
     */
    this.run = function() {

        $.ajax({
            url: '/m/mozlive/',
            type: 'post',
            data: {
                src: base.options.source,
                action: base.options.action,
                parameters: base.options.parameters,
                url: window.location.pathname
            },
            success: function(response) {
                if (response.error == true) {
                    if (response.reason == 'maintenance') {
                        alert(base.options.errors.maintenance);
                    }
                }
                else {
                    base.respond(response);
                    if (typeof base.options.onComplete == 'function') {
                        base.options.onComplete(response);
                    }
                }
            }
        });
    };

    /**
     * Responds after executing the MozLive function.
     */
    this.respond = function(response) {

        // Runs callbacks.

        if ($.isArray(base.options.response.callback)) {
            base.options.response.callback.forEach(function(value, index) {
                value(response);
            });
        }

        // Runs append tasks.

        if ($.isArray(base.options.response.append)) {
            base.options.response.append.forEach(function(value, index) {
                var obj = base.resolveObject(value);
                if (obj) {
                    obj.append(response);
                }
            });
        }

        // Runs replace tasks.

        if ($.isArray(base.options.response.replace)) {
            base.options.response.replace.forEach(function(value, index) {
                var obj = base.resolveObject(value);
                if (obj) {
                    if (typeof value.target == 'string') {
                        obj.find(value.target).replaceWith(response);
                    }
                    else {
                        obj.replaceWith(response);
                    }
                }
            });
        }

        // Runs replace HTML tasks.

        if ($.isArray(base.options.response.html)) {
            base.options.response.html.forEach(function(value, index) {
                var obj = base.resolveObject(value);
                if (obj) {
                    if (typeof value.target == 'string') {
                        obj.find(value.target).html(response);
                    }
                    else {
                        obj.html(response);
                    }
                }
            });
        }

        // Runs redirect tasks.

        if (typeof base.options.response.redirect == 'string') {
            var redirectTo = '';
            switch (base.options.response.redirect) {
                case '@response':
                    redirectTo = response;
                    break;
                case '@refresh':
                    redirectTo = '/m/refresh/';
                    break;
                default:
                    redirectTo = base.options.response.redirect;
                    break;
            }
            window.location.href = redirectTo;
        }
    };

    /**
     * Runs the MozLive function.
     */
    this.options = $.extend({}, this.defaults, settings);
    this.run();

    return false;
};

/* MozLive */

function mozLive(settings) {

    var base = this;

    /**
     * Default settings.
     */
    base.defaults = {
        src: null,          // Source component.
        dest: 'self',       // Destination component (for output).
        action: '',         // Component-specific action to execute.
        task: 'replace',    // Post-task for the output (append, replace).
        tasktarget: null,   // Post-task specific target (jQuery selector).
        parameters: {},     // Additional parameters for the action.
        errors: {
            maintenance: 'We can not process your request right now. Please try again later.'
        },
        onComplete: function() { }
    };

    base.processResult = function (response) {

        // Execute callback

        if (typeof base.options.parameters.callback !== 'undefined') {
            base.options.parameters.callback(response);
        }

        // Is it a refresh task?

        if (base.options.task === 'refresh') {
            window.location.href = '/m/refresh/';
            return;
        }

        // Is it a redirect task?

        if (base.options.task === 'redirect') {
            if (typeof base.options.parameters.href !== 'undefined') {
                window.location.href = base.options.parameters.href;
            }
            return;
        }

        if (base.options.task == 'redirect-response') {
            window.location.href = response;
            return;
        }

        if (base.options.task == 'replace-html') {
            var newDoc = document.open('text/html');
            newDoc.write(response);
            newDoc.close();
            return;
        }

        // It should be replace or append task.

        var updatable = null;
        var updatableJq = null;

        if (base.options.dest !== null && base.options.dest !== 'self') {
            updatable = base.options.dest;
        }
        if (base.options.dest === 'self') {
            updatable = base.options.src;
        }

        if (updatable != null) {
            if (typeof updatable.id !== 'undefined') {
                updatableJq = $('[data-cid="' + updatable.id + '"]');
            }
            else if (typeof updatable.name !== 'undefined') {
                updatableJq = $('[data-name="' + updatable.name + '"]');
            }
        }

        if (updatableJq != null) {
            switch (base.options.task) {
                case 'replace':
                    if (base.options.tasktarget == null) {
                        $(updatableJq).replaceWith(response);
                    }
                    else {
                        $(updatableJq).find(base.options.tasktarget).replaceWith(response);
                    }
                    break;

                case 'append':
                    $(updatableJq).append(response);
                    break;
            }
        }

    };

    /**
     * Executes the function.
     */
    base.run = function () {

        var base = this;

        $.ajax({
            url: '/m/mozlive/' + base.options.action + '/',
            type: 'post',
            data: {
                action: base.options.action,
                url: window.location.pathname,
                src: base.options.src,
                parameters: base.options.parameters,
            },
            success: function (result) {
                if (result.error == true) {
                    if (result.reason == 'maintenance') {
                        alert(base.options.errors.maintenance);
                    }
                }
                else {
                    base.processResult(result);
                    if (typeof base.options.onComplete == 'function') {
                        base.options.onComplete(result);
                    }
                }
            }
        });

    };

    // Runs the MozLive.

    base.options = $.extend({}, this.defaults, settings);
    base.run();

    return false;
}

/* End */