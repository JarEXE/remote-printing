module.exports = {
  ifEquals: function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  },
  lookup: function (value, key, array, options) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][key] == value) {
        return options.fn(array[i]);
      }
    }
  },
  ifvalue: function (val1, val2, options) {
    if (val1 === val2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
  inc: function (value) {
    return parseInt(value) + 1;
  },
  json: function (context) {
    return JSON.stringify(context);
  },
  ifCond: function (v1, operator, v2, options) {
    switch (operator) {
      case "==":
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case "===":
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case "!=":
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case "!==":
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case "<":
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case "<=":
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case ">":
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case ">=":
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case "&&":
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case "||":
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  },
  numberFormat: function (value, options) {
    // Helper parameters
    var dl = options.hash["decimalLength"] || 2;
    //var ts = options.hash["thousandsSep"] || ",";
    var ds = options.hash["decimalSep"] || ".";

    // Parse to float
    var value = parseFloat(value);

    // The regex
    var re = "\\d(?=(\\d{3})+" + (dl > 0 ? "\\D" : "$") + ")";

    // Formats the number with the decimals
    var num = value.toFixed(Math.max(0, ~~dl));

    // Returns the formatted number
    return (ds ? num.replace(".", ds) : num).replace(new RegExp(re, "g"), "$&");
  },
  formatDate: function (date) {
    var formattedDate = new Date(
      date.replace(/-/g, "/").replace(/T.+/, "")
    ).toLocaleDateString("en-NL", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    return formattedDate;
  },
  ifEmptyOrWhitespace: function (value, options) {
    if (!value) {
      return options.fn(this);
    }
    return value.replace(/\s*/g, "").length === 0
      ? options.fn(this)
      : options.inverse(this);
  },
  dateDiff: function (arg1, arg2, options) {
    let a = moment(arg1);
    let b = moment(arg2);
    return a.diff(b, "days");
  },
  isNull: function (value, options) {
    if (value === null) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },
};
