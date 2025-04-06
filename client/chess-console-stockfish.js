// node_modules/cm-chess/node_modules/cm-pgn/src/Header.js
var TAGS = {
  // Standard "Seven Tag Roster"
  Event: "Event",
  // the name of the tournament or match event
  Site: "Site",
  // the location of the event
  Date: "Date",
  // the starting date of the game (format: YYYY.MM.TT)
  Round: "Round",
  // the playing round ordinal of the game
  White: "White",
  // the player of the white pieces (last name, pre name)
  Black: "Black",
  // the player of the black pieces (last name, pre name)
  Result: "Result",
  // the result of the game (1-0, 1/2-1/2, 0-1, *)
  // Optional (http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm#c9)
  //      Player related information
  WhiteTitle: "WhiteTitle",
  BlackTitle: "BlackTitle",
  // These use string values such as "FM", "IM", and "GM"; these tags are used only for the standard abbreviations for FIDE titles. A value of "-" is used for an untitled player.
  WhiteElo: "WhiteElo",
  BlackElo: "BlackElo",
  // These tags use integer values; these are used for FIDE Elo ratings. A value of "-" is used for an unrated player.
  WhiteUSCF: "WhiteUSCF",
  BlackUSCF: "BlackUSCF",
  // These tags use integer values; these are used for USCF (United States Chess Federation) ratings. Similar tag names can be constructed for other rating agencies.
  WhiteNA: "WhiteNA",
  BlackNA: "BlackNA:",
  // These tags use string values; these are the e-mail or network addresses of the players. A value of "-" is used for a player without an electronic address.
  WhiteType: "WhiteType",
  BlackType: "BlackType",
  // These tags use string values; these describe the player types. The value "human" should be used for a person while the value "program" should be used for algorithmic (computer) players.
  //      Event related information
  EventDate: "EventDate",
  // This uses a date value, similar to the Date tag field, that gives the starting date of the Event.
  EventSponsor: "EventSponsor",
  // This uses a string value giving the name of the sponsor of the event.
  Section: "Section",
  // This uses a string; this is used for the playing section of a tournament (e.g., "Open" or "Reserve").
  Stage: "Stage",
  // This uses a string; this is used for the stage of a multistage event (e.g., "Preliminary" or "Semifinal").
  Board: "Board",
  // This uses an integer; this identifies the board number in a team event and also in a simultaneous exhibition.
  //      Opening information (locale specific)
  Opening: "Opening",
  // This uses a string; this is used for the traditional opening name. This will vary by locale. This tag pair is associated with the use of the EPD opcode "v0" described in a later section of this document.
  ECO: "ECO",
  // This uses a string of either the form "XDD" or the form "XDD/DD" where the "X" is a letter from "A" to "E" and the "D" positions are digits.
  //      Time and date related information
  Time: "Time",
  // Time the game started, in "HH:MM:SS" format, in local clock time.
  UTCTime: "UTCTime",
  // This tag is similar to the Time tag except that the time is given according to the Universal Coordinated Time standard.
  UTCDate: "UTCDate",
  // This tag is similar to the Date tag except that the date is given according to the Universal Coordinated Time standard.
  //      Time control
  TimeControl: "TimeControl",
  // 40/7200:3600 (moves per seconds: sudden death seconds)
  //      Alternative starting positions
  SetUp: "SetUp",
  // "0": position is start position, "1": tag FEN defines the position
  FEN: "FEN",
  //  Alternative start position, tag SetUp has to be set to "1"
  //      Game conclusion
  Termination: "Termination",
  // Gives more details about the termination of the game. It may be "abandoned", "adjudication" (result determined by third-party adjudication), "death", "emergency", "normal", "rules infraction", "time forfeit", or "unterminated".
  //      Miscellaneous
  Annotator: "Annotator",
  // The person providing notes to the game.
  Mode: "Mode",
  // "OTB" (over-the-board) "ICS" (Internet Chess Server)
  PlyCount: "PlyCount"
  // String value denoting total number of half-moves played.
};
var Header = class {
  constructor(headerString = "") {
    this.clear();
    const rows = headerString.match(/\[([^\]]+)]/g);
    if (rows && rows.length > 0) {
      for (let i2 = 0; i2 < rows.length; i2++) {
        let tag = rows[i2].match(/\[(\w+)\s+"([^"]+)"/);
        if (tag) {
          this.tags[tag[1]] = tag[2];
        }
      }
    }
  }
  clear() {
    this.tags = {};
  }
  render() {
    let rendered = "";
    for (const tag in this.tags) {
      rendered += `[${tag} "${this.tags[tag]}"]
`;
    }
    return rendered;
  }
};

// node_modules/cm-chess/node_modules/cm-pgn/src/parser/pgnParser.js
function peg$subclass(child, parent) {
  function ctor() {
    this.constructor = child;
  }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}
function peg$SyntaxError(message, expected, found, location) {
  this.message = message;
  this.expected = expected;
  this.found = found;
  this.location = location;
  this.name = "SyntaxError";
  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}
peg$subclass(peg$SyntaxError, Error);
peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function(expectation) {
      return '"' + literalEscape(expectation.text) + '"';
    },
    "class": function(expectation) {
      var escapedParts = "", i2;
      for (i2 = 0; i2 < expectation.parts.length; i2++) {
        escapedParts += expectation.parts[i2] instanceof Array ? classEscape(expectation.parts[i2][0]) + "-" + classEscape(expectation.parts[i2][1]) : classEscape(expectation.parts[i2]);
      }
      return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
    },
    any: function(expectation) {
      return "any character";
    },
    end: function(expectation) {
      return "end of input";
    },
    other: function(expectation) {
      return expectation.description;
    }
  };
  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }
  function literalEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function classEscape(s) {
    return s.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(ch) {
      return "\\x0" + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) {
      return "\\x" + hex(ch);
    });
  }
  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }
  function describeExpected(expected2) {
    var descriptions = new Array(expected2.length), i2, j;
    for (i2 = 0; i2 < expected2.length; i2++) {
      descriptions[i2] = describeExpectation(expected2[i2]);
    }
    descriptions.sort();
    if (descriptions.length > 0) {
      for (i2 = 1, j = 1; i2 < descriptions.length; i2++) {
        if (descriptions[i2 - 1] !== descriptions[i2]) {
          descriptions[j] = descriptions[i2];
          j++;
        }
      }
      descriptions.length = j;
    }
    switch (descriptions.length) {
      case 1:
        return descriptions[0];
      case 2:
        return descriptions[0] + " or " + descriptions[1];
      default:
        return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
    }
  }
  function describeFound(found2) {
    return found2 ? '"' + literalEscape(found2) + '"' : "end of input";
  }
  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};
function peg$parse(input, options) {
  options = options !== void 0 ? options : {};
  var peg$FAILED = {}, peg$startRuleFunctions = { pgn: peg$parsepgn }, peg$startRuleFunction = peg$parsepgn, peg$c0 = function(pw, all) {
    var arr = all ? all : [];
    arr.unshift(pw);
    return arr;
  }, peg$c1 = function(pb, all) {
    var arr = all ? all : [];
    arr.unshift(pb);
    return arr;
  }, peg$c2 = function() {
    return [[]];
  }, peg$c3 = function(pw) {
    return pw;
  }, peg$c4 = function(pb) {
    return pb;
  }, peg$c5 = function(cm, mn, cb, hm, nag, ca, vari, all) {
    var arr = all ? all : [];
    var move = {};
    move.turn = "w";
    move.moveNumber = mn;
    move.notation = hm;
    move.commentBefore = cb;
    move.commentAfter = ca;
    move.commentMove = cm;
    move.variations = vari ? vari : [];
    move.nag = nag ? nag : null;
    arr.unshift(move);
    return arr;
  }, peg$c6 = function(cm, me, cb, hm, nag, ca, vari, all) {
    var arr = all ? all : [];
    var move = {};
    move.turn = "b";
    move.moveNumber = me;
    move.notation = hm;
    move.commentBefore = cb;
    move.commentAfter = ca;
    move.variations = vari ? vari : [];
    arr.unshift(move);
    move.nag = nag ? nag : null;
    return arr;
  }, peg$c7 = "1:0", peg$c8 = peg$literalExpectation("1:0", false), peg$c9 = function() {
    return ["1:0"];
  }, peg$c10 = "0:1", peg$c11 = peg$literalExpectation("0:1", false), peg$c12 = function() {
    return ["0:1"];
  }, peg$c13 = "1-0", peg$c14 = peg$literalExpectation("1-0", false), peg$c15 = function() {
    return ["1-0"];
  }, peg$c16 = "0-1", peg$c17 = peg$literalExpectation("0-1", false), peg$c18 = function() {
    return ["0-1"];
  }, peg$c19 = "1/2-1/2", peg$c20 = peg$literalExpectation("1/2-1/2", false), peg$c21 = function() {
    return ["1/2-1/2"];
  }, peg$c22 = "*", peg$c23 = peg$literalExpectation("*", false), peg$c24 = function() {
    return ["*"];
  }, peg$c25 = /^[^}]/, peg$c26 = peg$classExpectation(["}"], true, false), peg$c27 = function(cm) {
    return cm.join("").trim();
  }, peg$c28 = "{", peg$c29 = peg$literalExpectation("{", false), peg$c30 = "}", peg$c31 = peg$literalExpectation("}", false), peg$c32 = function(vari, all, me) {
    var arr = all ? all : [];
    arr.unshift(vari);
    return arr;
  }, peg$c33 = function(vari, all) {
    var arr = all ? all : [];
    arr.unshift(vari);
    return arr;
  }, peg$c34 = "(", peg$c35 = peg$literalExpectation("(", false), peg$c36 = ")", peg$c37 = peg$literalExpectation(")", false), peg$c38 = ".", peg$c39 = peg$literalExpectation(".", false), peg$c40 = function(num) {
    return num;
  }, peg$c41 = peg$otherExpectation("integer"), peg$c42 = /^[0-9]/, peg$c43 = peg$classExpectation([["0", "9"]], false, false), peg$c44 = function(digits) {
    return makeInteger(digits);
  }, peg$c45 = " ", peg$c46 = peg$literalExpectation(" ", false), peg$c47 = function() {
    return "";
  }, peg$c48 = function(fig, disc, str, col, row, pr, ch) {
    var hm = {};
    hm.fig = fig ? fig : null;
    hm.disc = disc ? disc : null;
    hm.strike = str ? str : null;
    hm.col = col;
    hm.row = row;
    hm.check = ch ? ch : null;
    hm.promotion = pr;
    hm.notation = (fig ? fig : "") + (disc ? disc : "") + (str ? str : "") + col + row + (pr ? pr : "") + (ch ? ch : "");
    return hm;
  }, peg$c49 = function(fig, cols, rows, str, col, row, pr, ch) {
    var hm = {};
    hm.fig = fig ? fig : null;
    hm.strike = str == "x" ? str : null;
    hm.col = col;
    hm.row = row;
    hm.check = ch ? ch : null;
    hm.notation = (fig && fig !== "P" ? fig : "") + cols + rows + (str == "x" ? str : "-") + col + row + (pr ? pr : "") + (ch ? ch : "");
    hm.promotion = pr;
    return hm;
  }, peg$c50 = function(fig, str, col, row, pr, ch) {
    var hm = {};
    hm.fig = fig ? fig : null;
    hm.strike = str ? str : null;
    hm.col = col;
    hm.row = row;
    hm.check = ch ? ch : null;
    hm.notation = (fig ? fig : "") + (str ? str : "") + col + row + (pr ? pr : "") + (ch ? ch : "");
    hm.promotion = pr;
    return hm;
  }, peg$c51 = "O-O-O", peg$c52 = peg$literalExpectation("O-O-O", false), peg$c53 = function(ch) {
    var hm = {};
    hm.notation = "O-O-O" + (ch ? ch : "");
    hm.check = ch ? ch : null;
    return hm;
  }, peg$c54 = "O-O", peg$c55 = peg$literalExpectation("O-O", false), peg$c56 = function(ch) {
    var hm = {};
    hm.notation = "O-O" + (ch ? ch : "");
    hm.check = ch ? ch : null;
    return hm;
  }, peg$c57 = "+-", peg$c58 = peg$literalExpectation("+-", false), peg$c59 = "+", peg$c60 = peg$literalExpectation("+", false), peg$c61 = function(ch) {
    return ch[1];
  }, peg$c62 = "$$$", peg$c63 = peg$literalExpectation("$$$", false), peg$c64 = "#", peg$c65 = peg$literalExpectation("#", false), peg$c66 = "=", peg$c67 = peg$literalExpectation("=", false), peg$c68 = function(f) {
    return "=" + f;
  }, peg$c69 = function(nag, nags) {
    var arr = nags ? nags : [];
    arr.unshift(nag);
    return arr;
  }, peg$c70 = "$", peg$c71 = peg$literalExpectation("$", false), peg$c72 = function(num) {
    return "$" + num;
  }, peg$c73 = "!!", peg$c74 = peg$literalExpectation("!!", false), peg$c75 = function() {
    return "$3";
  }, peg$c76 = "??", peg$c77 = peg$literalExpectation("??", false), peg$c78 = function() {
    return "$4";
  }, peg$c79 = "!?", peg$c80 = peg$literalExpectation("!?", false), peg$c81 = function() {
    return "$5";
  }, peg$c82 = "?!", peg$c83 = peg$literalExpectation("?!", false), peg$c84 = function() {
    return "$6";
  }, peg$c85 = "!", peg$c86 = peg$literalExpectation("!", false), peg$c87 = function() {
    return "$1";
  }, peg$c88 = "?", peg$c89 = peg$literalExpectation("?", false), peg$c90 = function() {
    return "$2";
  }, peg$c91 = "\u203C", peg$c92 = peg$literalExpectation("\u203C", false), peg$c93 = "\u2047", peg$c94 = peg$literalExpectation("\u2047", false), peg$c95 = "\u2049", peg$c96 = peg$literalExpectation("\u2049", false), peg$c97 = "\u2048", peg$c98 = peg$literalExpectation("\u2048", false), peg$c99 = "\u25A1", peg$c100 = peg$literalExpectation("\u25A1", false), peg$c101 = function() {
    return "$7";
  }, peg$c102 = function() {
    return "$10";
  }, peg$c103 = "\u221E", peg$c104 = peg$literalExpectation("\u221E", false), peg$c105 = function() {
    return "$13";
  }, peg$c106 = "\u2A72", peg$c107 = peg$literalExpectation("\u2A72", false), peg$c108 = function() {
    return "$14";
  }, peg$c109 = "\u2A71", peg$c110 = peg$literalExpectation("\u2A71", false), peg$c111 = function() {
    return "$15";
  }, peg$c112 = "\xB1", peg$c113 = peg$literalExpectation("\xB1", false), peg$c114 = function() {
    return "$16";
  }, peg$c115 = "\u2213", peg$c116 = peg$literalExpectation("\u2213", false), peg$c117 = function() {
    return "$17";
  }, peg$c118 = function() {
    return "$18";
  }, peg$c119 = "-+", peg$c120 = peg$literalExpectation("-+", false), peg$c121 = function() {
    return "$19";
  }, peg$c122 = "\u2A00", peg$c123 = peg$literalExpectation("\u2A00", false), peg$c124 = function() {
    return "$22";
  }, peg$c125 = "\u27F3", peg$c126 = peg$literalExpectation("\u27F3", false), peg$c127 = function() {
    return "$32";
  }, peg$c128 = "\u2192", peg$c129 = peg$literalExpectation("\u2192", false), peg$c130 = function() {
    return "$36";
  }, peg$c131 = "\u2191", peg$c132 = peg$literalExpectation("\u2191", false), peg$c133 = function() {
    return "$40";
  }, peg$c134 = "\u21C6", peg$c135 = peg$literalExpectation("\u21C6", false), peg$c136 = function() {
    return "$132";
  }, peg$c137 = "D", peg$c138 = peg$literalExpectation("D", false), peg$c139 = function() {
    return "$220";
  }, peg$c140 = /^[RNBQKP]/, peg$c141 = peg$classExpectation(["R", "N", "B", "Q", "K", "P"], false, false), peg$c142 = /^[a-h]/, peg$c143 = peg$classExpectation([["a", "h"]], false, false), peg$c144 = /^[1-8]/, peg$c145 = peg$classExpectation([["1", "8"]], false, false), peg$c146 = "x", peg$c147 = peg$literalExpectation("x", false), peg$c148 = "-", peg$c149 = peg$literalExpectation("-", false), peg$currPos = 0, peg$savedPos = 0, peg$posDetailsCache = [{ line: 1, column: 1 }], peg$maxFailPos = 0, peg$maxFailExpected = [], peg$silentFails = 0, peg$result;
  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error(`Can't start parsing from rule "` + options.startRule + '".');
    }
    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }
  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }
  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }
  function expected(description, location2) {
    location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location2
    );
  }
  function error(message, location2) {
    location2 = location2 !== void 0 ? location2 : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildSimpleError(message, location2);
  }
  function peg$literalExpectation(text2, ignoreCase) {
    return { type: "literal", text: text2, ignoreCase };
  }
  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts, inverted, ignoreCase };
  }
  function peg$anyExpectation() {
    return { type: "any" };
  }
  function peg$endExpectation() {
    return { type: "end" };
  }
  function peg$otherExpectation(description) {
    return { type: "other", description };
  }
  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;
    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }
      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };
      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }
        p++;
      }
      peg$posDetailsCache[pos] = details;
      return details;
    }
  }
  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos), endPosDetails = peg$computePosDetails(endPos);
    return {
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }
  function peg$fail(expected2) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }
    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }
    peg$maxFailExpected.push(expected2);
  }
  function peg$buildSimpleError(message, location2) {
    return new peg$SyntaxError(message, null, null, location2);
  }
  function peg$buildStructuredError(expected2, found, location2) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected2, found),
      expected2,
      found,
      location2
    );
  }
  function peg$parsepgn() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = peg$parsepgnStartWhite();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepgnBlack();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c0(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsepgnStartBlack();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsepgnWhite();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c1(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsewhiteSpace();
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c2();
        }
        s0 = s1;
      }
    }
    return s0;
  }
  function peg$parsepgnStartWhite() {
    var s0, s1;
    s0 = peg$currPos;
    s1 = peg$parsepgnWhite();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c3(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parsepgnStartBlack() {
    var s0, s1;
    s0 = peg$currPos;
    s1 = peg$parsepgnBlack();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c4(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parsepgnWhite() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;
    s0 = peg$currPos;
    s1 = peg$parsewhiteSpace();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsecomment();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsewhiteSpace();
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsemoveNumber();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsewhiteSpace();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsecomment();
              if (s6 === peg$FAILED) {
                s6 = null;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsewhiteSpace();
                if (s7 === peg$FAILED) {
                  s7 = null;
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsehalfMove();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsewhiteSpace();
                    if (s9 === peg$FAILED) {
                      s9 = null;
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parsenags();
                      if (s10 === peg$FAILED) {
                        s10 = null;
                      }
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parsewhiteSpace();
                        if (s11 === peg$FAILED) {
                          s11 = null;
                        }
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parsecomment();
                          if (s12 === peg$FAILED) {
                            s12 = null;
                          }
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parsewhiteSpace();
                            if (s13 === peg$FAILED) {
                              s13 = null;
                            }
                            if (s13 !== peg$FAILED) {
                              s14 = peg$parsevariationWhite();
                              if (s14 === peg$FAILED) {
                                s14 = null;
                              }
                              if (s14 !== peg$FAILED) {
                                s15 = peg$parsepgnBlack();
                                if (s15 === peg$FAILED) {
                                  s15 = null;
                                }
                                if (s15 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s1 = peg$c5(s2, s4, s6, s8, s10, s12, s14, s15);
                                  s0 = s1;
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseendGame();
    }
    return s0;
  }
  function peg$parsepgnBlack() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;
    s0 = peg$currPos;
    s1 = peg$parsewhiteSpace();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsecomment();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsewhiteSpace();
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsemoveEllipse();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsewhiteSpace();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsecomment();
              if (s6 === peg$FAILED) {
                s6 = null;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsewhiteSpace();
                if (s7 === peg$FAILED) {
                  s7 = null;
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsehalfMove();
                  if (s8 !== peg$FAILED) {
                    s9 = peg$parsewhiteSpace();
                    if (s9 === peg$FAILED) {
                      s9 = null;
                    }
                    if (s9 !== peg$FAILED) {
                      s10 = peg$parsenags();
                      if (s10 === peg$FAILED) {
                        s10 = null;
                      }
                      if (s10 !== peg$FAILED) {
                        s11 = peg$parsewhiteSpace();
                        if (s11 === peg$FAILED) {
                          s11 = null;
                        }
                        if (s11 !== peg$FAILED) {
                          s12 = peg$parsecomment();
                          if (s12 === peg$FAILED) {
                            s12 = null;
                          }
                          if (s12 !== peg$FAILED) {
                            s13 = peg$parsewhiteSpace();
                            if (s13 === peg$FAILED) {
                              s13 = null;
                            }
                            if (s13 !== peg$FAILED) {
                              s14 = peg$parsevariationBlack();
                              if (s14 === peg$FAILED) {
                                s14 = null;
                              }
                              if (s14 !== peg$FAILED) {
                                s15 = peg$parsepgnWhite();
                                if (s15 === peg$FAILED) {
                                  s15 = null;
                                }
                                if (s15 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s1 = peg$c6(s2, s4, s6, s8, s10, s12, s14, s15);
                                  s0 = s1;
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseendGame();
    }
    return s0;
  }
  function peg$parseendGame() {
    var s0, s1;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c7) {
      s1 = peg$c7;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c8);
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c9();
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 3) === peg$c10) {
        s1 = peg$c10;
        peg$currPos += 3;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c11);
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c12();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 3) === peg$c13) {
          s1 = peg$c13;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c14);
          }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c15();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 3) === peg$c16) {
            s1 = peg$c16;
            peg$currPos += 3;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c17);
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c18();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 7) === peg$c19) {
              s1 = peg$c19;
              peg$currPos += 7;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c20);
              }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c21();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 42) {
                s1 = peg$c22;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c23);
                }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c24();
              }
              s0 = s1;
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parsecomment() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parsecl();
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (peg$c25.test(input.charAt(peg$currPos))) {
        s3 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c26);
        }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        if (peg$c25.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c26);
          }
        }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsecr();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c27(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsecl() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 123) {
      s0 = peg$c28;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c29);
      }
    }
    return s0;
  }
  function peg$parsecr() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 125) {
      s0 = peg$c30;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c31);
      }
    }
    return s0;
  }
  function peg$parsevariationWhite() {
    var s0, s1, s2, s3, s4, s5, s6, s7;
    s0 = peg$currPos;
    s1 = peg$parsepl();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepgnWhite();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsepr();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsewhiteSpace();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsevariationWhite();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parsewhiteSpace();
              if (s6 === peg$FAILED) {
                s6 = null;
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parsemoveEllipse();
                if (s7 === peg$FAILED) {
                  s7 = null;
                }
                if (s7 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c32(s2, s5, s7);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsevariationBlack() {
    var s0, s1, s2, s3, s4, s5;
    s0 = peg$currPos;
    s1 = peg$parsepl();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsepgnStartBlack();
      if (s2 !== peg$FAILED) {
        s3 = peg$parsepr();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsewhiteSpace();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsevariationBlack();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c33(s2, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsepl() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 40) {
      s0 = peg$c34;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c35);
      }
    }
    return s0;
  }
  function peg$parsepr() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 41) {
      s0 = peg$c36;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c37);
      }
    }
    return s0;
  }
  function peg$parsemoveNumber() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = peg$parseinteger();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 46) {
        s2 = peg$c38;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c39);
        }
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c40(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseinteger() {
    var s0, s1, s2;
    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c42.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c43);
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c42.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c43);
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c44(s1);
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c41);
      }
    }
    return s0;
  }
  function peg$parsewhiteSpace() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = [];
    if (input.charCodeAt(peg$currPos) === 32) {
      s2 = peg$c45;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c46);
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (input.charCodeAt(peg$currPos) === 32) {
          s2 = peg$c45;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c46);
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c47();
    }
    s0 = s1;
    return s0;
  }
  function peg$parsehalfMove() {
    var s0, s1, s2, s3, s4, s5, s6, s7, s8;
    s0 = peg$currPos;
    s1 = peg$parsefigure();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$currPos;
      peg$silentFails++;
      s3 = peg$parsecheckdisc();
      peg$silentFails--;
      if (s3 !== peg$FAILED) {
        peg$currPos = s2;
        s2 = void 0;
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsediscriminator();
        if (s3 !== peg$FAILED) {
          s4 = peg$parsestrike();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsecolumn();
            if (s5 !== peg$FAILED) {
              s6 = peg$parserow();
              if (s6 !== peg$FAILED) {
                s7 = peg$parsepromotion();
                if (s7 === peg$FAILED) {
                  s7 = null;
                }
                if (s7 !== peg$FAILED) {
                  s8 = peg$parsecheck();
                  if (s8 === peg$FAILED) {
                    s8 = null;
                  }
                  if (s8 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c48(s1, s3, s4, s5, s6, s7, s8);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parsefigure();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parsecolumn();
        if (s2 !== peg$FAILED) {
          s3 = peg$parserow();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsestrikeOrDash();
            if (s4 === peg$FAILED) {
              s4 = null;
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parsecolumn();
              if (s5 !== peg$FAILED) {
                s6 = peg$parserow();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parsepromotion();
                  if (s7 === peg$FAILED) {
                    s7 = null;
                  }
                  if (s7 !== peg$FAILED) {
                    s8 = peg$parsecheck();
                    if (s8 === peg$FAILED) {
                      s8 = null;
                    }
                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c49(s1, s2, s3, s4, s5, s6, s7, s8);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsefigure();
        if (s1 === peg$FAILED) {
          s1 = null;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parsestrike();
          if (s2 === peg$FAILED) {
            s2 = null;
          }
          if (s2 !== peg$FAILED) {
            s3 = peg$parsecolumn();
            if (s3 !== peg$FAILED) {
              s4 = peg$parserow();
              if (s4 !== peg$FAILED) {
                s5 = peg$parsepromotion();
                if (s5 === peg$FAILED) {
                  s5 = null;
                }
                if (s5 !== peg$FAILED) {
                  s6 = peg$parsecheck();
                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }
                  if (s6 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c50(s1, s2, s3, s4, s5, s6);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 5) === peg$c51) {
            s1 = peg$c51;
            peg$currPos += 5;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c52);
            }
          }
          if (s1 !== peg$FAILED) {
            s2 = peg$parsecheck();
            if (s2 === peg$FAILED) {
              s2 = null;
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c53(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 3) === peg$c54) {
              s1 = peg$c54;
              peg$currPos += 3;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c55);
              }
            }
            if (s1 !== peg$FAILED) {
              s2 = peg$parsecheck();
              if (s2 === peg$FAILED) {
                s2 = null;
              }
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c56(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parsecheck() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$currPos;
    peg$silentFails++;
    if (input.substr(peg$currPos, 2) === peg$c57) {
      s3 = peg$c57;
      peg$currPos += 2;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c58);
      }
    }
    peg$silentFails--;
    if (s3 === peg$FAILED) {
      s2 = void 0;
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 43) {
        s3 = peg$c59;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c60);
        }
      }
      if (s3 !== peg$FAILED) {
        s2 = [s2, s3];
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c61(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$currPos;
      peg$silentFails++;
      if (input.substr(peg$currPos, 3) === peg$c62) {
        s3 = peg$c62;
        peg$currPos += 3;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c63);
        }
      }
      peg$silentFails--;
      if (s3 === peg$FAILED) {
        s2 = void 0;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 35) {
          s3 = peg$c64;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c65);
          }
        }
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c61(s1);
      }
      s0 = s1;
    }
    return s0;
  }
  function peg$parsepromotion() {
    var s0, s1, s2;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 61) {
      s1 = peg$c66;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c67);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsefigure();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c68(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsenags() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parsenag();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsewhiteSpace();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsenags();
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c69(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsenag() {
    var s0, s1, s2;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 36) {
      s1 = peg$c70;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c71);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseinteger();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c72(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c73) {
        s1 = peg$c73;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c74);
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c75();
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c76) {
          s1 = peg$c76;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c77);
          }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c78();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c79) {
            s1 = peg$c79;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c80);
            }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c81();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c82) {
              s1 = peg$c82;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c83);
              }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c84();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 33) {
                s1 = peg$c85;
                peg$currPos++;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c86);
                }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c87();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 63) {
                  s1 = peg$c88;
                  peg$currPos++;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c89);
                  }
                }
                if (s1 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c90();
                }
                s0 = s1;
                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;
                  if (input.charCodeAt(peg$currPos) === 8252) {
                    s1 = peg$c91;
                    peg$currPos++;
                  } else {
                    s1 = peg$FAILED;
                    if (peg$silentFails === 0) {
                      peg$fail(peg$c92);
                    }
                  }
                  if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c75();
                  }
                  s0 = s1;
                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;
                    if (input.charCodeAt(peg$currPos) === 8263) {
                      s1 = peg$c93;
                      peg$currPos++;
                    } else {
                      s1 = peg$FAILED;
                      if (peg$silentFails === 0) {
                        peg$fail(peg$c94);
                      }
                    }
                    if (s1 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c78();
                    }
                    s0 = s1;
                    if (s0 === peg$FAILED) {
                      s0 = peg$currPos;
                      if (input.charCodeAt(peg$currPos) === 8265) {
                        s1 = peg$c95;
                        peg$currPos++;
                      } else {
                        s1 = peg$FAILED;
                        if (peg$silentFails === 0) {
                          peg$fail(peg$c96);
                        }
                      }
                      if (s1 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c81();
                      }
                      s0 = s1;
                      if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.charCodeAt(peg$currPos) === 8264) {
                          s1 = peg$c97;
                          peg$currPos++;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) {
                            peg$fail(peg$c98);
                          }
                        }
                        if (s1 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c84();
                        }
                        s0 = s1;
                        if (s0 === peg$FAILED) {
                          s0 = peg$currPos;
                          if (input.charCodeAt(peg$currPos) === 9633) {
                            s1 = peg$c99;
                            peg$currPos++;
                          } else {
                            s1 = peg$FAILED;
                            if (peg$silentFails === 0) {
                              peg$fail(peg$c100);
                            }
                          }
                          if (s1 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c101();
                          }
                          s0 = s1;
                          if (s0 === peg$FAILED) {
                            s0 = peg$currPos;
                            if (input.charCodeAt(peg$currPos) === 61) {
                              s1 = peg$c66;
                              peg$currPos++;
                            } else {
                              s1 = peg$FAILED;
                              if (peg$silentFails === 0) {
                                peg$fail(peg$c67);
                              }
                            }
                            if (s1 !== peg$FAILED) {
                              peg$savedPos = s0;
                              s1 = peg$c102();
                            }
                            s0 = s1;
                            if (s0 === peg$FAILED) {
                              s0 = peg$currPos;
                              if (input.charCodeAt(peg$currPos) === 8734) {
                                s1 = peg$c103;
                                peg$currPos++;
                              } else {
                                s1 = peg$FAILED;
                                if (peg$silentFails === 0) {
                                  peg$fail(peg$c104);
                                }
                              }
                              if (s1 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c105();
                              }
                              s0 = s1;
                              if (s0 === peg$FAILED) {
                                s0 = peg$currPos;
                                if (input.charCodeAt(peg$currPos) === 10866) {
                                  s1 = peg$c106;
                                  peg$currPos++;
                                } else {
                                  s1 = peg$FAILED;
                                  if (peg$silentFails === 0) {
                                    peg$fail(peg$c107);
                                  }
                                }
                                if (s1 !== peg$FAILED) {
                                  peg$savedPos = s0;
                                  s1 = peg$c108();
                                }
                                s0 = s1;
                                if (s0 === peg$FAILED) {
                                  s0 = peg$currPos;
                                  if (input.charCodeAt(peg$currPos) === 10865) {
                                    s1 = peg$c109;
                                    peg$currPos++;
                                  } else {
                                    s1 = peg$FAILED;
                                    if (peg$silentFails === 0) {
                                      peg$fail(peg$c110);
                                    }
                                  }
                                  if (s1 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c111();
                                  }
                                  s0 = s1;
                                  if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;
                                    if (input.charCodeAt(peg$currPos) === 177) {
                                      s1 = peg$c112;
                                      peg$currPos++;
                                    } else {
                                      s1 = peg$FAILED;
                                      if (peg$silentFails === 0) {
                                        peg$fail(peg$c113);
                                      }
                                    }
                                    if (s1 !== peg$FAILED) {
                                      peg$savedPos = s0;
                                      s1 = peg$c114();
                                    }
                                    s0 = s1;
                                    if (s0 === peg$FAILED) {
                                      s0 = peg$currPos;
                                      if (input.charCodeAt(peg$currPos) === 8723) {
                                        s1 = peg$c115;
                                        peg$currPos++;
                                      } else {
                                        s1 = peg$FAILED;
                                        if (peg$silentFails === 0) {
                                          peg$fail(peg$c116);
                                        }
                                      }
                                      if (s1 !== peg$FAILED) {
                                        peg$savedPos = s0;
                                        s1 = peg$c117();
                                      }
                                      s0 = s1;
                                      if (s0 === peg$FAILED) {
                                        s0 = peg$currPos;
                                        if (input.substr(peg$currPos, 2) === peg$c57) {
                                          s1 = peg$c57;
                                          peg$currPos += 2;
                                        } else {
                                          s1 = peg$FAILED;
                                          if (peg$silentFails === 0) {
                                            peg$fail(peg$c58);
                                          }
                                        }
                                        if (s1 !== peg$FAILED) {
                                          peg$savedPos = s0;
                                          s1 = peg$c118();
                                        }
                                        s0 = s1;
                                        if (s0 === peg$FAILED) {
                                          s0 = peg$currPos;
                                          if (input.substr(peg$currPos, 2) === peg$c119) {
                                            s1 = peg$c119;
                                            peg$currPos += 2;
                                          } else {
                                            s1 = peg$FAILED;
                                            if (peg$silentFails === 0) {
                                              peg$fail(peg$c120);
                                            }
                                          }
                                          if (s1 !== peg$FAILED) {
                                            peg$savedPos = s0;
                                            s1 = peg$c121();
                                          }
                                          s0 = s1;
                                          if (s0 === peg$FAILED) {
                                            s0 = peg$currPos;
                                            if (input.charCodeAt(peg$currPos) === 10752) {
                                              s1 = peg$c122;
                                              peg$currPos++;
                                            } else {
                                              s1 = peg$FAILED;
                                              if (peg$silentFails === 0) {
                                                peg$fail(peg$c123);
                                              }
                                            }
                                            if (s1 !== peg$FAILED) {
                                              peg$savedPos = s0;
                                              s1 = peg$c124();
                                            }
                                            s0 = s1;
                                            if (s0 === peg$FAILED) {
                                              s0 = peg$currPos;
                                              if (input.charCodeAt(peg$currPos) === 10227) {
                                                s1 = peg$c125;
                                                peg$currPos++;
                                              } else {
                                                s1 = peg$FAILED;
                                                if (peg$silentFails === 0) {
                                                  peg$fail(peg$c126);
                                                }
                                              }
                                              if (s1 !== peg$FAILED) {
                                                peg$savedPos = s0;
                                                s1 = peg$c127();
                                              }
                                              s0 = s1;
                                              if (s0 === peg$FAILED) {
                                                s0 = peg$currPos;
                                                if (input.charCodeAt(peg$currPos) === 8594) {
                                                  s1 = peg$c128;
                                                  peg$currPos++;
                                                } else {
                                                  s1 = peg$FAILED;
                                                  if (peg$silentFails === 0) {
                                                    peg$fail(peg$c129);
                                                  }
                                                }
                                                if (s1 !== peg$FAILED) {
                                                  peg$savedPos = s0;
                                                  s1 = peg$c130();
                                                }
                                                s0 = s1;
                                                if (s0 === peg$FAILED) {
                                                  s0 = peg$currPos;
                                                  if (input.charCodeAt(peg$currPos) === 8593) {
                                                    s1 = peg$c131;
                                                    peg$currPos++;
                                                  } else {
                                                    s1 = peg$FAILED;
                                                    if (peg$silentFails === 0) {
                                                      peg$fail(peg$c132);
                                                    }
                                                  }
                                                  if (s1 !== peg$FAILED) {
                                                    peg$savedPos = s0;
                                                    s1 = peg$c133();
                                                  }
                                                  s0 = s1;
                                                  if (s0 === peg$FAILED) {
                                                    s0 = peg$currPos;
                                                    if (input.charCodeAt(peg$currPos) === 8646) {
                                                      s1 = peg$c134;
                                                      peg$currPos++;
                                                    } else {
                                                      s1 = peg$FAILED;
                                                      if (peg$silentFails === 0) {
                                                        peg$fail(peg$c135);
                                                      }
                                                    }
                                                    if (s1 !== peg$FAILED) {
                                                      peg$savedPos = s0;
                                                      s1 = peg$c136();
                                                    }
                                                    s0 = s1;
                                                    if (s0 === peg$FAILED) {
                                                      s0 = peg$currPos;
                                                      if (input.charCodeAt(peg$currPos) === 68) {
                                                        s1 = peg$c137;
                                                        peg$currPos++;
                                                      } else {
                                                        s1 = peg$FAILED;
                                                        if (peg$silentFails === 0) {
                                                          peg$fail(peg$c138);
                                                        }
                                                      }
                                                      if (s1 !== peg$FAILED) {
                                                        peg$savedPos = s0;
                                                        s1 = peg$c139();
                                                      }
                                                      s0 = s1;
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parsediscriminator() {
    var s0;
    s0 = peg$parsecolumn();
    if (s0 === peg$FAILED) {
      s0 = peg$parserow();
    }
    return s0;
  }
  function peg$parsecheckdisc() {
    var s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    s1 = peg$parsediscriminator();
    if (s1 !== peg$FAILED) {
      s2 = peg$parsestrike();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsecolumn();
        if (s3 !== peg$FAILED) {
          s4 = peg$parserow();
          if (s4 !== peg$FAILED) {
            s1 = [s1, s2, s3, s4];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsemoveEllipse() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parseinteger();
    if (s1 !== peg$FAILED) {
      s2 = [];
      if (input.charCodeAt(peg$currPos) === 46) {
        s3 = peg$c38;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c39);
        }
      }
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          if (input.charCodeAt(peg$currPos) === 46) {
            s3 = peg$c38;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c39);
            }
          }
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c40(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsefigure() {
    var s0;
    if (peg$c140.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c141);
      }
    }
    return s0;
  }
  function peg$parsecolumn() {
    var s0;
    if (peg$c142.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c143);
      }
    }
    return s0;
  }
  function peg$parserow() {
    var s0;
    if (peg$c144.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c145);
      }
    }
    return s0;
  }
  function peg$parsestrike() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 120) {
      s0 = peg$c146;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c147);
      }
    }
    return s0;
  }
  function peg$parsestrikeOrDash() {
    var s0;
    if (input.charCodeAt(peg$currPos) === 120) {
      s0 = peg$c146;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c147);
      }
    }
    if (s0 === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 45) {
        s0 = peg$c148;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c149);
        }
      }
    }
    return s0;
  }
  function makeInteger(o) {
    return parseInt(o.join(""), 10);
  }
  peg$result = peg$startRuleFunction();
  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }
    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}
var pgnParser = class {
  static parse(history, options) {
    return peg$parse(history, options);
  }
};

// node_modules/chess.mjs/src/Chess.js
var SYMBOLS = "pnbrqkPNBRQK";
var DEFAULT_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
var TERMINATION_MARKERS = ["1-0", "0-1", "1/2-1/2", "*"];
var PAWN_OFFSETS = {
  b: [16, 32, 17, 15],
  w: [-16, -32, -17, -15]
};
var PIECE_OFFSETS = {
  n: [-18, -33, -31, -14, 18, 33, 31, 14],
  b: [-17, -15, 17, 15],
  r: [-16, 1, 16, -1],
  q: [-17, -16, -15, 1, 17, 16, 15, -1],
  k: [-17, -16, -15, 1, 17, 16, 15, -1]
};
var ATTACKS = [
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  24,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  2,
  24,
  2,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  53,
  56,
  53,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  24,
  24,
  24,
  24,
  24,
  56,
  0,
  56,
  24,
  24,
  24,
  24,
  24,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  2,
  53,
  56,
  53,
  2,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  2,
  24,
  2,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  24,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  20
];
var RAYS = [
  17,
  0,
  0,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  17,
  0,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  17,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  0,
  0,
  16,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  0,
  16,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  17,
  16,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  -16,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  -16,
  0,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  -16,
  0,
  0,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  -17,
  0,
  0,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  0,
  -17,
  0,
  0,
  0,
  0,
  -15,
  0,
  0,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  0,
  0,
  -17,
  0,
  0,
  -15,
  0,
  0,
  0,
  0,
  0,
  0,
  -16,
  0,
  0,
  0,
  0,
  0,
  0,
  -17
];
var SHIFTS = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 };
var BITS = {
  NORMAL: 1,
  CAPTURE: 2,
  BIG_PAWN: 4,
  EP_CAPTURE: 8,
  PROMOTION: 16,
  KSIDE_CASTLE: 32,
  QSIDE_CASTLE: 64
};
var RANK_1 = 7;
var RANK_2 = 6;
var RANK_7 = 1;
var RANK_8 = 0;
var SQUARE_MAP = {
  a8: 0,
  b8: 1,
  c8: 2,
  d8: 3,
  e8: 4,
  f8: 5,
  g8: 6,
  h8: 7,
  a7: 16,
  b7: 17,
  c7: 18,
  d7: 19,
  e7: 20,
  f7: 21,
  g7: 22,
  h7: 23,
  a6: 32,
  b6: 33,
  c6: 34,
  d6: 35,
  e6: 36,
  f6: 37,
  g6: 38,
  h6: 39,
  a5: 48,
  b5: 49,
  c5: 50,
  d5: 51,
  e5: 52,
  f5: 53,
  g5: 54,
  h5: 55,
  a4: 64,
  b4: 65,
  c4: 66,
  d4: 67,
  e4: 68,
  f4: 69,
  g4: 70,
  h4: 71,
  a3: 80,
  b3: 81,
  c3: 82,
  d3: 83,
  e3: 84,
  f3: 85,
  g3: 86,
  h3: 87,
  a2: 96,
  b2: 97,
  c2: 98,
  d2: 99,
  e2: 100,
  f2: 101,
  g2: 102,
  h2: 103,
  a1: 112,
  b1: 113,
  c1: 114,
  d1: 115,
  e1: 116,
  f1: 117,
  g1: 118,
  h1: 119
};
var ROOKS = {
  w: [
    { square: SQUARE_MAP.a1, flag: BITS.QSIDE_CASTLE },
    { square: SQUARE_MAP.h1, flag: BITS.KSIDE_CASTLE }
  ],
  b: [
    { square: SQUARE_MAP.a8, flag: BITS.QSIDE_CASTLE },
    { square: SQUARE_MAP.h8, flag: BITS.KSIDE_CASTLE }
  ]
};
var PARSER_STRICT = 0;
var PARSER_SLOPPY = 1;
function get_disambiguator(move, moves) {
  var from = move.from;
  var to = move.to;
  var piece = move.piece;
  var ambiguities = 0;
  var same_rank = 0;
  var same_file = 0;
  for (var i2 = 0, len = moves.length; i2 < len; i2++) {
    var ambig_from = moves[i2].from;
    var ambig_to = moves[i2].to;
    var ambig_piece = moves[i2].piece;
    if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
      ambiguities++;
      if (rank(from) === rank(ambig_from)) {
        same_rank++;
      }
      if (file(from) === file(ambig_from)) {
        same_file++;
      }
    }
  }
  if (ambiguities > 0) {
    if (same_rank > 0 && same_file > 0) {
      return algebraic(from);
    } else if (same_file > 0) {
      return algebraic(from).charAt(1);
    } else {
      return algebraic(from).charAt(0);
    }
  }
  return "";
}
function infer_piece_type(san) {
  var piece_type = san.charAt(0);
  if (piece_type >= "a" && piece_type <= "h") {
    var matches = san.match(/[a-h]\d.*[a-h]\d/);
    if (matches) {
      return void 0;
    }
    return PAWN;
  }
  piece_type = piece_type.toLowerCase();
  if (piece_type === "o") {
    return KING;
  }
  return piece_type;
}
function stripped_san(move) {
  return move.replace(/=/, "").replace(/[+#]?[?!]*$/, "");
}
function rank(i2) {
  return i2 >> 4;
}
function file(i2) {
  return i2 & 15;
}
function algebraic(i2) {
  var f = file(i2), r = rank(i2);
  return "abcdefgh".substring(f, f + 1) + "87654321".substring(r, r + 1);
}
function swap_color(c) {
  return c === WHITE ? BLACK : WHITE;
}
function is_digit(c) {
  return "0123456789".indexOf(c) !== -1;
}
function clone(obj) {
  var dupe = obj instanceof Array ? [] : {};
  for (var property in obj) {
    if (typeof property === "object") {
      dupe[property] = clone(obj[property]);
    } else {
      dupe[property] = obj[property];
    }
  }
  return dupe;
}
function trim(str) {
  return str.replace(/^\s+|\s+$/g, "");
}
var BLACK = "b";
var WHITE = "w";
var EMPTY = -1;
var PAWN = "p";
var KNIGHT = "n";
var BISHOP = "b";
var ROOK = "r";
var QUEEN = "q";
var KING = "k";
var SQUARES = function() {
  var keys = [];
  for (var i2 = SQUARE_MAP.a8; i2 <= SQUARE_MAP.h1; i2++) {
    if (i2 & 136) {
      i2 += 7;
      continue;
    }
    keys.push(algebraic(i2));
  }
  return keys;
}();
var FLAGS = {
  NORMAL: "n",
  CAPTURE: "c",
  BIG_PAWN: "b",
  EP_CAPTURE: "e",
  PROMOTION: "p",
  KSIDE_CASTLE: "k",
  QSIDE_CASTLE: "q"
};
var Chess = function(fen) {
  var board = new Array(128);
  var kings = { w: EMPTY, b: EMPTY };
  var turn = WHITE;
  var castling = { w: 0, b: 0 };
  var ep_square = EMPTY;
  var half_moves = 0;
  var move_number = 1;
  var history = [];
  var header = {};
  var comments = {};
  if (typeof fen === "undefined") {
    load(DEFAULT_POSITION);
  } else {
    load(fen);
  }
  function clear(keep_headers) {
    if (typeof keep_headers === "undefined") {
      keep_headers = false;
    }
    board = new Array(128);
    kings = { w: EMPTY, b: EMPTY };
    turn = WHITE;
    castling = { w: 0, b: 0 };
    ep_square = EMPTY;
    half_moves = 0;
    move_number = 1;
    history = [];
    if (!keep_headers) header = {};
    comments = {};
    update_setup(generate_fen());
  }
  function prune_comments() {
    var reversed_history = [];
    var current_comments = {};
    var copy_comment = function(fen2) {
      if (fen2 in comments) {
        current_comments[fen2] = comments[fen2];
      }
    };
    while (history.length > 0) {
      reversed_history.push(undo_move());
    }
    copy_comment(generate_fen());
    while (reversed_history.length > 0) {
      make_move(reversed_history.pop());
      copy_comment(generate_fen());
    }
    comments = current_comments;
  }
  function reset() {
    load(DEFAULT_POSITION);
  }
  function load(fen2, keep_headers) {
    if (typeof keep_headers === "undefined") {
      keep_headers = false;
    }
    var tokens = fen2.split(/\s+/);
    var position = tokens[0];
    var square = 0;
    if (!validate_fen(fen2).valid) {
      return false;
    }
    clear(keep_headers);
    for (var i2 = 0; i2 < position.length; i2++) {
      var piece = position.charAt(i2);
      if (piece === "/") {
        square += 8;
      } else if (is_digit(piece)) {
        square += parseInt(piece, 10);
      } else {
        var color = piece < "a" ? WHITE : BLACK;
        put({ type: piece.toLowerCase(), color }, algebraic(square));
        square++;
      }
    }
    turn = tokens[1];
    if (tokens[2].indexOf("K") > -1) {
      castling.w |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf("Q") > -1) {
      castling.w |= BITS.QSIDE_CASTLE;
    }
    if (tokens[2].indexOf("k") > -1) {
      castling.b |= BITS.KSIDE_CASTLE;
    }
    if (tokens[2].indexOf("q") > -1) {
      castling.b |= BITS.QSIDE_CASTLE;
    }
    ep_square = tokens[3] === "-" ? EMPTY : SQUARE_MAP[tokens[3]];
    half_moves = parseInt(tokens[4], 10);
    move_number = parseInt(tokens[5], 10);
    update_setup(generate_fen());
    return true;
  }
  function validate_fen(fen2) {
    var errors = {
      0: "No errors.",
      1: "FEN string must contain six space-delimited fields.",
      2: "6th field (move number) must be a positive integer.",
      3: "5th field (half move counter) must be a non-negative integer.",
      4: "4th field (en-passant square) is invalid.",
      5: "3rd field (castling availability) is invalid.",
      6: "2nd field (side to move) is invalid.",
      7: "1st field (piece positions) does not contain 8 '/'-delimited rows.",
      8: "1st field (piece positions) is invalid [consecutive numbers].",
      9: "1st field (piece positions) is invalid [invalid piece].",
      10: "1st field (piece positions) is invalid [row too large].",
      11: "Illegal en-passant square"
    };
    var tokens = fen2.split(/\s+/);
    if (tokens.length !== 6) {
      return { valid: false, error_number: 1, error: errors[1] };
    }
    if (isNaN(parseInt(tokens[5])) || parseInt(tokens[5], 10) <= 0) {
      return { valid: false, error_number: 2, error: errors[2] };
    }
    if (isNaN(parseInt(tokens[4])) || parseInt(tokens[4], 10) < 0) {
      return { valid: false, error_number: 3, error: errors[3] };
    }
    if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
      return { valid: false, error_number: 4, error: errors[4] };
    }
    if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
      return { valid: false, error_number: 5, error: errors[5] };
    }
    if (!/^(w|b)$/.test(tokens[1])) {
      return { valid: false, error_number: 6, error: errors[6] };
    }
    var rows = tokens[0].split("/");
    if (rows.length !== 8) {
      return { valid: false, error_number: 7, error: errors[7] };
    }
    for (var i2 = 0; i2 < rows.length; i2++) {
      var sum_fields = 0;
      var previous_was_number = false;
      for (var k = 0; k < rows[i2].length; k++) {
        if (!isNaN(rows[i2][k])) {
          if (previous_was_number) {
            return { valid: false, error_number: 8, error: errors[8] };
          }
          sum_fields += parseInt(rows[i2][k], 10);
          previous_was_number = true;
        } else {
          if (!/^[prnbqkPRNBQK]$/.test(rows[i2][k])) {
            return { valid: false, error_number: 9, error: errors[9] };
          }
          sum_fields += 1;
          previous_was_number = false;
        }
      }
      if (sum_fields !== 8) {
        return { valid: false, error_number: 10, error: errors[10] };
      }
    }
    if (tokens[3][1] == "3" && tokens[1] == "w" || tokens[3][1] == "6" && tokens[1] == "b") {
      return { valid: false, error_number: 11, error: errors[11] };
    }
    return { valid: true, error_number: 0, error: errors[0] };
  }
  function generate_fen() {
    var empty = 0;
    var fen2 = "";
    for (var i2 = SQUARE_MAP.a8; i2 <= SQUARE_MAP.h1; i2++) {
      if (board[i2] == null) {
        empty++;
      } else {
        if (empty > 0) {
          fen2 += empty;
          empty = 0;
        }
        var color = board[i2].color;
        var piece = board[i2].type;
        fen2 += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
      }
      if (i2 + 1 & 136) {
        if (empty > 0) {
          fen2 += empty;
        }
        if (i2 !== SQUARE_MAP.h1) {
          fen2 += "/";
        }
        empty = 0;
        i2 += 8;
      }
    }
    var cflags = "";
    if (castling[WHITE] & BITS.KSIDE_CASTLE) {
      cflags += "K";
    }
    if (castling[WHITE] & BITS.QSIDE_CASTLE) {
      cflags += "Q";
    }
    if (castling[BLACK] & BITS.KSIDE_CASTLE) {
      cflags += "k";
    }
    if (castling[BLACK] & BITS.QSIDE_CASTLE) {
      cflags += "q";
    }
    cflags = cflags || "-";
    var epflags = ep_square === EMPTY ? "-" : algebraic(ep_square);
    return [fen2, turn, cflags, epflags, half_moves, move_number].join(" ");
  }
  function set_header(args) {
    for (var i2 = 0; i2 < args.length; i2 += 2) {
      if (typeof args[i2] === "string" && typeof args[i2 + 1] === "string") {
        header[args[i2]] = args[i2 + 1];
      }
    }
    return header;
  }
  function update_setup(fen2) {
    if (history.length > 0) return;
    if (fen2 !== DEFAULT_POSITION) {
      header["SetUp"] = "1";
      header["FEN"] = fen2;
    } else {
      delete header["SetUp"];
      delete header["FEN"];
    }
  }
  function get(square) {
    var piece = board[SQUARE_MAP[square]];
    return piece ? { type: piece.type, color: piece.color } : null;
  }
  function put(piece, square) {
    if (!("type" in piece && "color" in piece)) {
      return false;
    }
    if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
      return false;
    }
    if (!(square in SQUARE_MAP)) {
      return false;
    }
    var sq = SQUARE_MAP[square];
    if (piece.type == KING && !(kings[piece.color] == EMPTY || kings[piece.color] == sq)) {
      return false;
    }
    board[sq] = { type: piece.type, color: piece.color };
    if (piece.type === KING) {
      kings[piece.color] = sq;
    }
    update_setup(generate_fen());
    return true;
  }
  function remove(square) {
    var piece = get(square);
    board[SQUARE_MAP[square]] = null;
    if (piece && piece.type === KING) {
      kings[piece.color] = EMPTY;
    }
    update_setup(generate_fen());
    return piece;
  }
  function build_move(board2, from, to, flags, promotion) {
    var move = {
      color: turn,
      from,
      to,
      flags,
      piece: board2[from].type
    };
    if (promotion) {
      move.flags |= BITS.PROMOTION;
      move.promotion = promotion;
    }
    if (board2[to]) {
      move.captured = board2[to].type;
    } else if (flags & BITS.EP_CAPTURE) {
      move.captured = PAWN;
    }
    return move;
  }
  function generate_moves(options) {
    function add_move(board2, moves2, from, to, flags) {
      if (board2[from].type === PAWN && (rank(to) === RANK_8 || rank(to) === RANK_1)) {
        var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];
        for (var i3 = 0, len2 = pieces.length; i3 < len2; i3++) {
          moves2.push(build_move(board2, from, to, flags, pieces[i3]));
        }
      } else {
        moves2.push(build_move(board2, from, to, flags));
      }
    }
    var moves = [];
    var us = turn;
    var them = swap_color(us);
    var second_rank = { b: RANK_7, w: RANK_2 };
    var first_sq = SQUARE_MAP.a8;
    var last_sq = SQUARE_MAP.h1;
    var single_square = false;
    var legal = typeof options !== "undefined" && "legal" in options ? options.legal : true;
    var piece_type = typeof options !== "undefined" && "piece" in options && typeof options.piece === "string" ? options.piece.toLowerCase() : true;
    if (typeof options !== "undefined" && "square" in options) {
      if (options.square in SQUARE_MAP) {
        first_sq = last_sq = SQUARE_MAP[options.square];
        single_square = true;
      } else {
        return [];
      }
    }
    for (var i2 = first_sq; i2 <= last_sq; i2++) {
      if (i2 & 136) {
        i2 += 7;
        continue;
      }
      var piece = board[i2];
      if (piece == null || piece.color !== us) {
        continue;
      }
      if (piece.type === PAWN && (piece_type === true || piece_type === PAWN)) {
        var square = i2 + PAWN_OFFSETS[us][0];
        if (board[square] == null) {
          add_move(board, moves, i2, square, BITS.NORMAL);
          var square = i2 + PAWN_OFFSETS[us][1];
          if (second_rank[us] === rank(i2) && board[square] == null) {
            add_move(board, moves, i2, square, BITS.BIG_PAWN);
          }
        }
        for (j = 2; j < 4; j++) {
          var square = i2 + PAWN_OFFSETS[us][j];
          if (square & 136) continue;
          if (board[square] != null && board[square].color === them) {
            add_move(board, moves, i2, square, BITS.CAPTURE);
          } else if (square === ep_square) {
            add_move(board, moves, i2, ep_square, BITS.EP_CAPTURE);
          }
        }
      } else if (piece_type === true || piece_type === piece.type) {
        for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
          var offset = PIECE_OFFSETS[piece.type][j];
          var square = i2;
          while (true) {
            square += offset;
            if (square & 136) break;
            if (board[square] == null) {
              add_move(board, moves, i2, square, BITS.NORMAL);
            } else {
              if (board[square].color === us) break;
              add_move(board, moves, i2, square, BITS.CAPTURE);
              break;
            }
            if (piece.type === "n" || piece.type === "k") break;
          }
        }
      }
    }
    if (piece_type === true || piece_type === KING) {
      if (!single_square || last_sq === kings[us]) {
        if (castling[us] & BITS.KSIDE_CASTLE) {
          var castling_from = kings[us];
          var castling_to = castling_from + 2;
          if (board[castling_from + 1] == null && board[castling_to] == null && !attacked(them, kings[us]) && !attacked(them, castling_from + 1) && !attacked(them, castling_to)) {
            add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE);
          }
        }
        if (castling[us] & BITS.QSIDE_CASTLE) {
          var castling_from = kings[us];
          var castling_to = castling_from - 2;
          if (board[castling_from - 1] == null && board[castling_from - 2] == null && board[castling_from - 3] == null && !attacked(them, kings[us]) && !attacked(them, castling_from - 1) && !attacked(them, castling_to)) {
            add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE);
          }
        }
      }
    }
    if (!legal) {
      return moves;
    }
    var legal_moves = [];
    for (var i2 = 0, len = moves.length; i2 < len; i2++) {
      make_move(moves[i2]);
      if (!king_attacked(us)) {
        legal_moves.push(moves[i2]);
      }
      undo_move();
    }
    return legal_moves;
  }
  function move_to_san(move, moves) {
    var output = "";
    if (move.flags & BITS.KSIDE_CASTLE) {
      output = "O-O";
    } else if (move.flags & BITS.QSIDE_CASTLE) {
      output = "O-O-O";
    } else {
      if (move.piece !== PAWN) {
        var disambiguator = get_disambiguator(move, moves);
        output += move.piece.toUpperCase() + disambiguator;
      }
      if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
        if (move.piece === PAWN) {
          output += algebraic(move.from)[0];
        }
        output += "x";
      }
      output += algebraic(move.to);
      if (move.flags & BITS.PROMOTION) {
        output += "=" + move.promotion.toUpperCase();
      }
    }
    make_move(move);
    if (in_check()) {
      if (in_checkmate()) {
        output += "#";
      } else {
        output += "+";
      }
    }
    undo_move();
    return output;
  }
  function attacked(color, square) {
    for (var i2 = SQUARE_MAP.a8; i2 <= SQUARE_MAP.h1; i2++) {
      if (i2 & 136) {
        i2 += 7;
        continue;
      }
      if (board[i2] == null || board[i2].color !== color) continue;
      var piece = board[i2];
      var difference = i2 - square;
      var index = difference + 119;
      if (ATTACKS[index] & 1 << SHIFTS[piece.type]) {
        if (piece.type === PAWN) {
          if (difference > 0) {
            if (piece.color === WHITE) return true;
          } else {
            if (piece.color === BLACK) return true;
          }
          continue;
        }
        if (piece.type === "n" || piece.type === "k") return true;
        var offset = RAYS[index];
        var j = i2 + offset;
        var blocked = false;
        while (j !== square) {
          if (board[j] != null) {
            blocked = true;
            break;
          }
          j += offset;
        }
        if (!blocked) return true;
      }
    }
    return false;
  }
  function king_attacked(color) {
    return attacked(swap_color(color), kings[color]);
  }
  function in_check() {
    return king_attacked(turn);
  }
  function in_checkmate() {
    return in_check() && generate_moves().length === 0;
  }
  function in_stalemate() {
    return !in_check() && generate_moves().length === 0;
  }
  function insufficient_material() {
    var pieces = {};
    var bishops = [];
    var num_pieces = 0;
    var sq_color = 0;
    for (var i2 = SQUARE_MAP.a8; i2 <= SQUARE_MAP.h1; i2++) {
      sq_color = (sq_color + 1) % 2;
      if (i2 & 136) {
        i2 += 7;
        continue;
      }
      var piece = board[i2];
      if (piece) {
        pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;
        if (piece.type === BISHOP) {
          bishops.push(sq_color);
        }
        num_pieces++;
      }
    }
    if (num_pieces === 2) {
      return true;
    } else if (
      /* k vs. kn .... or .... k vs. kb */
      num_pieces === 3 && (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)
    ) {
      return true;
    } else if (num_pieces === pieces[BISHOP] + 2) {
      var sum = 0;
      var len = bishops.length;
      for (var i2 = 0; i2 < len; i2++) {
        sum += bishops[i2];
      }
      if (sum === 0 || sum === len) {
        return true;
      }
    }
    return false;
  }
  function in_threefold_repetition() {
    var moves = [];
    var positions = {};
    var repetition = false;
    while (true) {
      var move = undo_move();
      if (!move) break;
      moves.push(move);
    }
    while (true) {
      var fen2 = generate_fen().split(" ").slice(0, 4).join(" ");
      positions[fen2] = fen2 in positions ? positions[fen2] + 1 : 1;
      if (positions[fen2] >= 3) {
        repetition = true;
      }
      if (!moves.length) {
        break;
      }
      make_move(moves.pop());
    }
    return repetition;
  }
  function push(move) {
    history.push({
      move,
      kings: { b: kings.b, w: kings.w },
      turn,
      castling: { b: castling.b, w: castling.w },
      ep_square,
      half_moves,
      move_number
    });
  }
  function make_move(move) {
    var us = turn;
    var them = swap_color(us);
    push(move);
    board[move.to] = board[move.from];
    board[move.from] = null;
    if (move.flags & BITS.EP_CAPTURE) {
      if (turn === BLACK) {
        board[move.to - 16] = null;
      } else {
        board[move.to + 16] = null;
      }
    }
    if (move.flags & BITS.PROMOTION) {
      board[move.to] = { type: move.promotion, color: us };
    }
    if (board[move.to].type === KING) {
      kings[board[move.to].color] = move.to;
      if (move.flags & BITS.KSIDE_CASTLE) {
        var castling_to = move.to - 1;
        var castling_from = move.to + 1;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        var castling_to = move.to + 1;
        var castling_from = move.to - 2;
        board[castling_to] = board[castling_from];
        board[castling_from] = null;
      }
      castling[us] = "";
    }
    if (castling[us]) {
      for (var i2 = 0, len = ROOKS[us].length; i2 < len; i2++) {
        if (move.from === ROOKS[us][i2].square && castling[us] & ROOKS[us][i2].flag) {
          castling[us] ^= ROOKS[us][i2].flag;
          break;
        }
      }
    }
    if (castling[them]) {
      for (var i2 = 0, len = ROOKS[them].length; i2 < len; i2++) {
        if (move.to === ROOKS[them][i2].square && castling[them] & ROOKS[them][i2].flag) {
          castling[them] ^= ROOKS[them][i2].flag;
          break;
        }
      }
    }
    if (move.flags & BITS.BIG_PAWN) {
      if (turn === "b") {
        ep_square = move.to - 16;
      } else {
        ep_square = move.to + 16;
      }
    } else {
      ep_square = EMPTY;
    }
    if (move.piece === PAWN) {
      half_moves = 0;
    } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
      half_moves = 0;
    } else {
      half_moves++;
    }
    if (turn === BLACK) {
      move_number++;
    }
    turn = swap_color(turn);
  }
  function undo_move() {
    var old = history.pop();
    if (old == null) {
      return null;
    }
    var move = old.move;
    kings = old.kings;
    turn = old.turn;
    castling = old.castling;
    ep_square = old.ep_square;
    half_moves = old.half_moves;
    move_number = old.move_number;
    var us = turn;
    var them = swap_color(turn);
    board[move.from] = board[move.to];
    board[move.from].type = move.piece;
    board[move.to] = null;
    if (move.flags & BITS.CAPTURE) {
      board[move.to] = { type: move.captured, color: them };
    } else if (move.flags & BITS.EP_CAPTURE) {
      var index;
      if (us === BLACK) {
        index = move.to - 16;
      } else {
        index = move.to + 16;
      }
      board[index] = { type: PAWN, color: them };
    }
    if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
      var castling_to, castling_from;
      if (move.flags & BITS.KSIDE_CASTLE) {
        castling_to = move.to + 1;
        castling_from = move.to - 1;
      } else if (move.flags & BITS.QSIDE_CASTLE) {
        castling_to = move.to - 2;
        castling_from = move.to + 1;
      }
      board[castling_to] = board[castling_from];
      board[castling_from] = null;
    }
    return move;
  }
  function move_from_san(move, sloppy) {
    var clean_move = stripped_san(move);
    for (var parser = 0; parser < 2; parser++) {
      if (parser == PARSER_SLOPPY) {
        if (!sloppy) {
          return null;
        }
        var overly_disambiguated = false;
        var matches = clean_move.match(
          /([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/
        );
        if (matches) {
          var piece = matches[1];
          var from = matches[2];
          var to = matches[3];
          var promotion = matches[4];
          if (from.length == 1) {
            overly_disambiguated = true;
          }
        } else {
          var matches = clean_move.match(
            /([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/
          );
          if (matches) {
            var piece = matches[1];
            var from = matches[2];
            var to = matches[3];
            var promotion = matches[4];
            if (from.length == 1) {
              var overly_disambiguated = true;
            }
          }
        }
      }
      var piece_type = infer_piece_type(clean_move);
      var moves = generate_moves({
        legal: true,
        piece: piece ? piece : piece_type
      });
      for (var i2 = 0, len = moves.length; i2 < len; i2++) {
        switch (parser) {
          case PARSER_STRICT: {
            if (clean_move === stripped_san(move_to_san(moves[i2], moves))) {
              return moves[i2];
            }
            break;
          }
          case PARSER_SLOPPY: {
            if (matches) {
              if ((!piece || piece.toLowerCase() == moves[i2].piece) && SQUARE_MAP[from] == moves[i2].from && SQUARE_MAP[to] == moves[i2].to && (!promotion || promotion.toLowerCase() == moves[i2].promotion)) {
                return moves[i2];
              } else if (overly_disambiguated) {
                var square = algebraic(moves[i2].from);
                if ((!piece || piece.toLowerCase() == moves[i2].piece) && SQUARE_MAP[to] == moves[i2].to && (from == square[0] || from == square[1]) && (!promotion || promotion.toLowerCase() == moves[i2].promotion)) {
                  return moves[i2];
                }
              }
            }
          }
        }
      }
    }
    return null;
  }
  function make_pretty(ugly_move) {
    var move = clone(ugly_move);
    move.san = move_to_san(move, generate_moves({ legal: true }));
    move.to = algebraic(move.to);
    move.from = algebraic(move.from);
    var flags = "";
    for (var flag in BITS) {
      if (BITS[flag] & move.flags) {
        flags += FLAGS[flag];
      }
    }
    move.flags = flags;
    return move;
  }
  function perft(depth) {
    var moves = generate_moves({ legal: false });
    var nodes = 0;
    var color = turn;
    for (var i2 = 0, len = moves.length; i2 < len; i2++) {
      make_move(moves[i2]);
      if (!king_attacked(color)) {
        if (depth - 1 > 0) {
          var child_nodes = perft(depth - 1);
          nodes += child_nodes;
        } else {
          nodes++;
        }
      }
      undo_move();
    }
    return nodes;
  }
  return {
    /***************************************************************************
     * PUBLIC API
     **************************************************************************/
    load: function(fen2) {
      return load(fen2);
    },
    reset: function() {
      return reset();
    },
    moves: function(options) {
      var ugly_moves = generate_moves(options);
      var moves = [];
      for (var i2 = 0, len = ugly_moves.length; i2 < len; i2++) {
        if (typeof options !== "undefined" && "verbose" in options && options.verbose) {
          moves.push(make_pretty(ugly_moves[i2]));
        } else {
          moves.push(
            move_to_san(ugly_moves[i2], generate_moves({ legal: true }))
          );
        }
      }
      return moves;
    },
    in_check: function() {
      return in_check();
    },
    in_checkmate: function() {
      return in_checkmate();
    },
    in_stalemate: function() {
      return in_stalemate();
    },
    in_draw: function() {
      return half_moves >= 100 || in_stalemate() || insufficient_material() || in_threefold_repetition();
    },
    insufficient_material: function() {
      return insufficient_material();
    },
    in_threefold_repetition: function() {
      return in_threefold_repetition();
    },
    game_over: function() {
      return half_moves >= 100 || in_checkmate() || in_stalemate() || insufficient_material() || in_threefold_repetition();
    },
    validate_fen: function(fen2) {
      return validate_fen(fen2);
    },
    fen: function() {
      return generate_fen();
    },
    board: function() {
      var output = [], row = [];
      for (var i2 = SQUARE_MAP.a8; i2 <= SQUARE_MAP.h1; i2++) {
        if (board[i2] == null) {
          row.push(null);
        } else {
          row.push({
            square: algebraic(i2),
            type: board[i2].type,
            color: board[i2].color
          });
        }
        if (i2 + 1 & 136) {
          output.push(row);
          row = [];
          i2 += 8;
        }
      }
      return output;
    },
    pgn: function(options) {
      var newline = typeof options === "object" && typeof options.newline_char === "string" ? options.newline_char : "\n";
      var max_width = typeof options === "object" && typeof options.max_width === "number" ? options.max_width : 0;
      var result = [];
      var header_exists = false;
      for (var i2 in header) {
        result.push("[" + i2 + ' "' + header[i2] + '"]' + newline);
        header_exists = true;
      }
      if (header_exists && history.length) {
        result.push(newline);
      }
      var append_comment = function(move_string2) {
        var comment = comments[generate_fen()];
        if (typeof comment !== "undefined") {
          var delimiter = move_string2.length > 0 ? " " : "";
          move_string2 = `${move_string2}${delimiter}{${comment}}`;
        }
        return move_string2;
      };
      var reversed_history = [];
      while (history.length > 0) {
        reversed_history.push(undo_move());
      }
      var moves = [];
      var move_string = "";
      if (reversed_history.length === 0) {
        moves.push(append_comment(""));
      }
      while (reversed_history.length > 0) {
        move_string = append_comment(move_string);
        var move = reversed_history.pop();
        if (!history.length && move.color === "b") {
          const prefix = `${move_number}. ...`;
          move_string = move_string ? `${move_string} ${prefix}` : prefix;
        } else if (move.color === "w") {
          if (move_string.length) {
            moves.push(move_string);
          }
          move_string = move_number + ".";
        }
        move_string = move_string + " " + move_to_san(move, generate_moves({ legal: true }));
        make_move(move);
      }
      if (move_string.length) {
        moves.push(append_comment(move_string));
      }
      if (typeof header.Result !== "undefined") {
        moves.push(header.Result);
      }
      if (max_width === 0) {
        return result.join("") + moves.join(" ");
      }
      var strip = function() {
        if (result.length > 0 && result[result.length - 1] === " ") {
          result.pop();
          return true;
        }
        return false;
      };
      var wrap_comment = function(width, move2) {
        for (var token of move2.split(" ")) {
          if (!token) {
            continue;
          }
          if (width + token.length > max_width) {
            while (strip()) {
              width--;
            }
            result.push(newline);
            width = 0;
          }
          result.push(token);
          width += token.length;
          result.push(" ");
          width++;
        }
        if (strip()) {
          width--;
        }
        return width;
      };
      var current_width = 0;
      for (var i2 = 0; i2 < moves.length; i2++) {
        if (current_width + moves[i2].length > max_width) {
          if (moves[i2].includes("{")) {
            current_width = wrap_comment(current_width, moves[i2]);
            continue;
          }
        }
        if (current_width + moves[i2].length > max_width && i2 !== 0) {
          if (result[result.length - 1] === " ") {
            result.pop();
          }
          result.push(newline);
          current_width = 0;
        } else if (i2 !== 0) {
          result.push(" ");
          current_width++;
        }
        result.push(moves[i2]);
        current_width += moves[i2].length;
      }
      return result.join("");
    },
    load_pgn: function(pgn, options) {
      var sloppy = typeof options !== "undefined" && "sloppy" in options ? options.sloppy : false;
      function mask(str) {
        return str.replace(/\\/g, "\\");
      }
      function parse_pgn_header(header2, options2) {
        var newline_char2 = typeof options2 === "object" && typeof options2.newline_char === "string" ? options2.newline_char : "\r?\n";
        var header_obj = {};
        var headers2 = header2.split(new RegExp(mask(newline_char2)));
        var key2 = "";
        var value = "";
        for (var i2 = 0; i2 < headers2.length; i2++) {
          var regex = /^\s*\[([A-Za-z]+)\s*"(.*)"\s*\]\s*$/;
          key2 = headers2[i2].replace(regex, "$1");
          value = headers2[i2].replace(regex, "$2");
          if (trim(key2).length > 0) {
            header_obj[key2] = value;
          }
        }
        return header_obj;
      }
      pgn = pgn.trim();
      var newline_char = typeof options === "object" && typeof options.newline_char === "string" ? options.newline_char : "\r?\n";
      var header_regex = new RegExp(
        "^(\\[((?:" + mask(newline_char) + ")|.)*\\])(?:\\s*" + mask(newline_char) + "){2}"
      );
      var header_string = header_regex.test(pgn) ? header_regex.exec(pgn)[1] : "";
      reset();
      var headers = parse_pgn_header(header_string, options);
      var fen2 = "";
      for (var key in headers) {
        if (key.toLowerCase() === "fen") {
          fen2 = headers[key];
        }
        set_header([key, headers[key]]);
      }
      if (sloppy) {
        if (fen2) {
          if (!load(fen2, true)) {
            return false;
          }
        }
      } else {
        if (headers["SetUp"] === "1") {
          if (!("FEN" in headers && load(headers["FEN"], true))) {
            return false;
          }
        }
      }
      var to_hex = function(string) {
        return Array.from(string).map(function(c) {
          return c.charCodeAt(0) < 128 ? c.charCodeAt(0).toString(16) : encodeURIComponent(c).replace(/\%/g, "").toLowerCase();
        }).join("");
      };
      var from_hex = function(string) {
        return string.length == 0 ? "" : decodeURIComponent("%" + string.match(/.{1,2}/g).join("%"));
      };
      var encode_comment = function(string) {
        string = string.replace(new RegExp(mask(newline_char), "g"), " ");
        return `{${to_hex(string.slice(1, string.length - 1))}}`;
      };
      var decode_comment = function(string) {
        if (string.startsWith("{") && string.endsWith("}")) {
          return from_hex(string.slice(1, string.length - 1));
        }
      };
      var ms = pgn.replace(header_string, "").replace(
        /* encode comments so they don't get deleted below */
        new RegExp(`({[^}]*})+?|;([^${mask(newline_char)}]*)`, "g"),
        function(match, bracket, semicolon) {
          return bracket !== void 0 ? encode_comment(bracket) : " " + encode_comment(`{${semicolon.slice(1)}}`);
        }
      ).replace(new RegExp(mask(newline_char), "g"), " ");
      var rav_regex = /(\([^\(\)]+\))+?/g;
      while (rav_regex.test(ms)) {
        ms = ms.replace(rav_regex, "");
      }
      ms = ms.replace(/\d+\.(\.\.)?/g, "");
      ms = ms.replace(/\.\.\./g, "");
      ms = ms.replace(/\$\d+/g, "");
      var moves = trim(ms).split(new RegExp(/\s+/));
      moves = moves.join(",").replace(/,,+/g, ",").split(",");
      var move = "";
      var result = "";
      for (var half_move = 0; half_move < moves.length; half_move++) {
        var comment = decode_comment(moves[half_move]);
        if (comment !== void 0) {
          comments[generate_fen()] = comment;
          continue;
        }
        move = move_from_san(moves[half_move], sloppy);
        if (move == null) {
          if (TERMINATION_MARKERS.indexOf(moves[half_move]) > -1) {
            result = moves[half_move];
          } else {
            return false;
          }
        } else {
          result = "";
          make_move(move);
        }
      }
      if (result && Object.keys(header).length && !header["Result"]) {
        set_header(["Result", result]);
      }
      return true;
    },
    header: function() {
      return set_header(arguments);
    },
    turn: function() {
      return turn;
    },
    move: function(move, options) {
      var sloppy = typeof options !== "undefined" && "sloppy" in options ? options.sloppy : false;
      var move_obj = null;
      if (typeof move === "string") {
        move_obj = move_from_san(move, sloppy);
      } else if (typeof move === "object") {
        var moves = generate_moves();
        for (var i2 = 0, len = moves.length; i2 < len; i2++) {
          if (move.from === algebraic(moves[i2].from) && move.to === algebraic(moves[i2].to) && (!("promotion" in moves[i2]) || move.promotion === moves[i2].promotion)) {
            move_obj = moves[i2];
            break;
          }
        }
      }
      if (!move_obj) {
        return null;
      }
      var pretty_move = make_pretty(move_obj);
      make_move(move_obj);
      return pretty_move;
    },
    undo: function() {
      var move = undo_move();
      return move ? make_pretty(move) : null;
    },
    clear: function() {
      return clear();
    },
    put: function(piece, square) {
      return put(piece, square);
    },
    get: function(square) {
      return get(square);
    },
    ascii() {
      var s = "   +------------------------+\n";
      for (var i2 = SQUARE_MAP.a8; i2 <= SQUARE_MAP.h1; i2++) {
        if (file(i2) === 0) {
          s += " " + "87654321"[rank(i2)] + " |";
        }
        if (board[i2] == null) {
          s += " . ";
        } else {
          var piece = board[i2].type;
          var color = board[i2].color;
          var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
          s += " " + symbol + " ";
        }
        if (i2 + 1 & 136) {
          s += "|\n";
          i2 += 8;
        }
      }
      s += "   +------------------------+\n";
      s += "     a  b  c  d  e  f  g  h";
      return s;
    },
    remove: function(square) {
      return remove(square);
    },
    perft: function(depth) {
      return perft(depth);
    },
    square_color: function(square) {
      if (square in SQUARE_MAP) {
        var sq_0x88 = SQUARE_MAP[square];
        return (rank(sq_0x88) + file(sq_0x88)) % 2 === 0 ? "light" : "dark";
      }
      return null;
    },
    history: function(options) {
      var reversed_history = [];
      var move_history = [];
      var verbose = typeof options !== "undefined" && "verbose" in options && options.verbose;
      while (history.length > 0) {
        reversed_history.push(undo_move());
      }
      while (reversed_history.length > 0) {
        var move = reversed_history.pop();
        if (verbose) {
          move_history.push(make_pretty(move));
        } else {
          move_history.push(move_to_san(move, generate_moves({ legal: true })));
        }
        make_move(move);
      }
      return move_history;
    },
    get_comment: function() {
      return comments[generate_fen()];
    },
    set_comment: function(comment) {
      comments[generate_fen()] = comment.replace("{", "[").replace("}", "]");
    },
    delete_comment: function() {
      var comment = comments[generate_fen()];
      delete comments[generate_fen()];
      return comment;
    },
    get_comments: function() {
      prune_comments();
      return Object.keys(comments).map(function(fen2) {
        return { fen: fen2, comment: comments[fen2] };
      });
    },
    delete_comments: function() {
      prune_comments();
      return Object.keys(comments).map(function(fen2) {
        var comment = comments[fen2];
        delete comments[fen2];
        return { fen: fen2, comment };
      });
    }
  };
};

// node_modules/cm-chess/node_modules/cm-pgn/src/History.js
function IllegalMoveException(fen, notation) {
  this.fen = fen;
  this.notation = notation;
  this.toString = function() {
    return "IllegalMoveException: " + fen + " => " + notation;
  };
}
var History = class {
  constructor(historyString = null, setUpFen = null, sloppy = false) {
    if (!historyString) {
      this.clear();
    } else {
      const parsedMoves = pgnParser.parse(
        historyString.replace(/\s\s+/g, " ").replace(/\n/g, " ")
      );
      this.moves = this.traverse(parsedMoves[0], setUpFen, null, 1, sloppy);
    }
    this.setUpFen = setUpFen;
  }
  clear() {
    this.moves = [];
  }
  traverse(parsedMoves, fen, parent = null, ply = 1, sloppy = false) {
    const chess = fen ? new Chess(fen) : new Chess();
    const moves = [];
    let previousMove = parent;
    for (let parsedMove of parsedMoves) {
      if (parsedMove.notation) {
        const notation = parsedMove.notation.notation;
        const move = chess.move(notation, { sloppy });
        if (move) {
          if (previousMove) {
            move.previous = previousMove;
            previousMove.next = move;
          } else {
            move.previous = null;
          }
          move.ply = ply;
          this.fillMoveFromChessState(move, chess);
          if (parsedMove.nag) {
            move.nag = parsedMove.nag[0];
          }
          if (parsedMove.commentBefore) {
            move.commentBefore = parsedMove.commentBefore;
          }
          if (parsedMove.commentMove) {
            move.commentMove = parsedMove.commentMove;
          }
          if (parsedMove.commentAfter) {
            move.commentAfter = parsedMove.commentAfter;
          }
          move.variations = [];
          const parsedVariations = parsedMove.variations;
          if (parsedVariations.length > 0) {
            const lastFen = moves.length > 0 ? moves[moves.length - 1].fen : fen;
            for (let parsedVariation of parsedVariations) {
              move.variations.push(this.traverse(parsedVariation, lastFen, previousMove, ply, sloppy));
            }
          }
          move.variation = moves;
          moves.push(move);
          previousMove = move;
        } else {
          throw new IllegalMoveException(chess.fen(), notation);
        }
      }
      ply++;
    }
    return moves;
  }
  fillMoveFromChessState(move, chess) {
    move.fen = chess.fen();
    move.uci = move.from + move.to + (move.promotion ? move.promotion : "");
    move.variations = [];
    if (chess.game_over()) {
      move.gameOver = true;
      if (chess.in_draw()) {
        move.inDraw = true;
      }
      if (chess.in_stalemate()) {
        move.inStalemate = true;
      }
      if (chess.insufficient_material()) {
        move.insufficientMaterial = true;
      }
      if (chess.in_threefold_repetition()) {
        move.inThreefoldRepetition = true;
      }
      if (chess.in_checkmate()) {
        move.inCheckmate = true;
      }
    }
    if (chess.in_check()) {
      move.inCheck = true;
    }
  }
  /**
   * @param move
   * @return the history to the move which may be in a variation
   */
  historyToMove(move) {
    const moves = [];
    let pointer = move;
    moves.push(pointer);
    while (pointer.previous) {
      moves.push(pointer.previous);
      pointer = pointer.previous;
    }
    return moves.reverse();
  }
  /**
   * Don't add the move, just validate, if it would be correct
   * @param notation
   * @param previous
   * @param sloppy
   * @returns {[]|{}}
   */
  validateMove(notation, previous = null, sloppy = true) {
    if (!previous) {
      if (this.moves.length > 0) {
        previous = this.moves[this.moves.length - 1];
      }
    }
    const chess = new Chess(this.setUpFen ? this.setUpFen : void 0);
    if (previous) {
      const historyToMove = this.historyToMove(previous);
      for (const moveInHistory of historyToMove) {
        chess.move(moveInHistory);
      }
    }
    const move = chess.move(notation, { sloppy });
    if (move) {
      this.fillMoveFromChessState(move, chess);
    }
    return move;
  }
  addMove(notation, previous = null, sloppy = true) {
    if (!previous) {
      if (this.moves.length > 0) {
        previous = this.moves[this.moves.length - 1];
      }
    }
    const move = this.validateMove(notation, previous, sloppy);
    if (!move) {
      throw new Error("invalid move");
    }
    move.previous = previous;
    if (previous) {
      move.ply = previous.ply + 1;
      move.uci = move.from + move.to + (move.promotion ? move.promotion : "");
      if (previous.next) {
        previous.next.variations.push([]);
        move.variation = previous.next.variations[previous.next.variations.length - 1];
        move.variation.push(move);
      } else {
        previous.next = move;
        move.variation = previous.variation;
        previous.variation.push(move);
      }
    } else {
      move.variation = this.moves;
      move.ply = 1;
      this.moves.push(move);
    }
    return move;
  }
  render(renderComments = true, renderNags = true) {
    const renderVariation = (variation, needReminder = false) => {
      let result = "";
      for (let move of variation) {
        if (move.ply % 2 === 1) {
          result += Math.floor(move.ply / 2) + 1 + ". ";
        } else if (result.length === 0 || needReminder) {
          result += move.ply / 2 + "... ";
        }
        needReminder = false;
        if (renderNags && move.nag) {
          result += "$" + move.nag + " ";
        }
        if (renderComments && move.commentBefore) {
          result += "{" + move.commentBefore + "} ";
          needReminder = true;
        }
        result += move.san + " ";
        if (renderComments && move.commentMove) {
          result += "{" + move.commentMove + "} ";
          needReminder = true;
        }
        if (renderComments && move.commentAfter) {
          result += "{" + move.commentAfter + "} ";
          needReminder = true;
        }
        if (move.variations.length > 0) {
          for (let variation2 of move.variations) {
            result += "(" + renderVariation(variation2) + ") ";
            needReminder = true;
          }
        }
        result += " ";
      }
      return result;
    };
    let ret = renderVariation(this.moves);
    ret = ret.replace(/\s+\)/g, ")");
    ret = ret.replace(/\s\s+/g, " ").trim();
    return ret;
  }
};

// node_modules/cm-chess/node_modules/cm-pgn/src/Pgn.js
var Pgn = class {
  constructor(pgnString = "", props = {}) {
    const lastHeaderElement = pgnString.trim().slice(-1) === "]" ? pgnString.length : pgnString.lastIndexOf("]\n\n") + 1;
    const headerString = pgnString.substring(0, lastHeaderElement);
    const historyString = pgnString.substring(lastHeaderElement);
    const sloppy = !!props.sloppy;
    this.header = new Header(headerString);
    if (this.header.tags[TAGS.SetUp] === "1" && this.header.tags[TAGS.FEN]) {
      this.history = new History(historyString, this.header.tags[TAGS.FEN], sloppy);
    } else {
      this.history = new History(historyString, null, sloppy);
    }
  }
  wrap(str, maxLength) {
    const words = str.split(" ");
    let lines = [];
    let line = "";
    for (let i2 = 0; i2 < words.length; i2++) {
      const word = words[i2];
      if (line.length + word.length < maxLength) {
        line += word + " ";
      } else {
        lines.push(line.trim());
        line = word + " ";
      }
    }
    lines.push(line.trim());
    return lines.join("\n");
  }
  render(renderHeader = true, renderComments = true, renderNags = true) {
    const header = renderHeader ? this.header.render() + "\n" : "";
    let history = this.history.render(renderComments, renderNags);
    if (this.header.tags[TAGS.Result]) {
      history += " " + this.header.tags[TAGS.Result];
    }
    return header + this.wrap(history, 80);
  }
};

// node_modules/cm-chess/src/Chess.js
var PIECES = {
  p: { name: "pawn", value: 1 },
  n: { name: "knight", value: 3 },
  b: { name: "bishop", value: 3 },
  r: { name: "rook", value: 5 },
  q: { name: "queen", value: 9 },
  k: { name: "king", value: Infinity }
};
var COLOR2 = {
  white: "w",
  black: "b"
};
var FEN = {
  empty: "8/8/8/8/8/8/8/8 w - - 0 1",
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
};
var EVENT_TYPE = {
  illegalMove: "illegalMove",
  legalMove: "legalMove",
  undoMove: "undoMove",
  initialized: "initialized"
};
function publishEvent(observers, event) {
  for (const observer of observers) {
    setTimeout(() => {
      observer(event);
    });
  }
}
var Chess2 = class {
  constructor(fenOrProps = FEN.start) {
    this.observers = [];
    if (typeof fenOrProps === "string") {
      this.load(fenOrProps);
    } else {
      if (fenOrProps.fen) {
        this.load(fenOrProps.fen);
      } else if (fenOrProps.pgn) {
        this.loadPgn(fenOrProps.pgn);
      } else {
        this.load(FEN.start);
      }
    }
  }
  /**
   * @returns {string} the FEN of the last move, or the setUpFen(), if no move was made.
   */
  fen(move = this.lastMove()) {
    if (move) {
      return move.fen;
    } else {
      return this.setUpFen();
    }
  }
  /**
   * @returns {string} the setUp FEN in the header or the default start-FEN
   */
  setUpFen() {
    if (this.pgn.header.tags[TAGS.SetUp]) {
      return this.pgn.header.tags[TAGS.FEN];
    } else {
      return FEN.start;
    }
  }
  /**
   * @returns {Map<string, string>} the header tags of the PGN.
   */
  header() {
    return this.pgn.header.tags;
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is over at that move
   */
  gameOver(move = this.lastMove()) {
    if (move) {
      return move.gameOver;
    } else {
      return new Chess(this.fen()).game_over();
    }
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is in draw at that move
   */
  inDraw(move = this.lastMove()) {
    if (move) {
      return move.inDraw === true;
    } else {
      return new Chess(this.fen()).in_draw();
    }
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is in statemate at that move
   */
  inStalemate(move = this.lastMove()) {
    if (move) {
      return move.inStalemate === true;
    } else {
      return new Chess(this.fen()).in_stalemate();
    }
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is in draw, because of unsufficiant material at that move
   */
  insufficientMaterial(move = this.lastMove()) {
    if (move) {
      return move.insufficientMaterial === true;
    } else {
      return new Chess(this.fen()).insufficient_material();
    }
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is in draw, because of threefold repetition at that move
   */
  inThreefoldRepetition(move = this.lastMove()) {
    return move && move.inThreefoldRepetition === true;
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is in checkmate at that move
   */
  inCheckmate(move = this.lastMove()) {
    if (move) {
      return move.inCheckmate === true;
    } else {
      return new Chess(this.fen()).in_checkmate();
    }
  }
  /**
   * @param move optional
   * @returns {boolean} true, if the game is in check at that move
   */
  inCheck(move = this.lastMove()) {
    if (move) {
      return move.inCheck === true;
    } else {
      return new Chess(this.fen()).in_check();
    }
  }
  /**
   * cm-chess uses cm-pgn for the history and header. See https://github.com/shaack/cm-pgn
   * @returns {[]} the moves of the game history
   */
  history() {
    return this.pgn.history.moves;
  }
  /**
   * @returns {null|move} the last move of the main variation or `null`, if no move was made
   */
  lastMove() {
    if (this.pgn.history.moves.length > 0) {
      return this.pgn.history.moves[this.pgn.history.moves.length - 1];
    } else {
      return null;
    }
  }
  /**
   * Load a FEN
   * @param fen
   */
  load(fen) {
    const chess = new Chess(fen);
    if (chess && chess.fen() === fen) {
      this.pgn = new Pgn();
      if (fen !== FEN.start) {
        this.pgn.header.tags[TAGS.SetUp] = "1";
        this.pgn.header.tags[TAGS.FEN] = chess.fen();
        this.pgn.history.setUpFen = fen;
      }
    } else {
      throw Error("Invalid fen " + fen);
    }
    publishEvent(this.observers, { type: EVENT_TYPE.initialized, fen });
  }
  /**
   * Load a PGN with variations, NAGs, header and annotations. cm-chess uses cm-pgn
   * fot the header and history. See https://github.com/shaack/cm-pgn
   * @param pgn
   */
  loadPgn(pgn) {
    this.pgn = new Pgn(pgn);
    publishEvent(this.observers, { type: EVENT_TYPE.initialized, pgn });
  }
  /**
   * Make a move in the game.
   * @param move
   * @param previousMove optional, the previous move (for variations)
   * @param sloppy to allow sloppy SAN
   * @returns {{}|null}
   */
  move(move, previousMove = void 0, sloppy = true) {
    try {
      const moveResult = this.pgn.history.addMove(move, previousMove, sloppy);
      publishEvent(
        this.observers,
        { type: EVENT_TYPE.legalMove, move: moveResult, previousMove }
      );
      return moveResult;
    } catch (e) {
      publishEvent(
        this.observers,
        { type: EVENT_TYPE.illegalMove, move, previousMove }
      );
      return null;
    }
  }
  /**
   * Return all valid moves
   * @param options {{ square: "e2", piece: "n", verbose: true }}
   * Fields with { verbose: true }
   * - `color` indicates the color of the moving piece (w or b).
   * - `from` and `to` fields are from and to squares in algebraic notation.
   * - `piece`, `captured`, and `promotion` fields contain the lowercase representation of the applicable piece (pnbrqk). The captured and promotion fields are only present when the move is a valid capture or promotion.
   * - `san` is the move in Standard Algebraic Notation (SAN).
   * - `flags` field contains one or more of the string values:
   *      n - a non-capture
   *      b - a pawn push of two squares
   *      e - an en passant capture
   *      c - a standard capture
   *      p - a promotion
   *      k - kingside castling
   *      q - queenside castling
   *   A flags value of pc would mean that a pawn captured a piece on the 8th rank and promoted.
   * @param move
   * @returns {{}}
   */
  moves(options = void 0, move = this.lastMove()) {
    const chessJs = new Chess(this.fen(move));
    return chessJs.moves(options);
  }
  /**
   * Don't make a move, just validate, if it would be a correct move
   * @param move
   * @param previousMove optional, the previous move (for variations)
   * @param sloppy to allow sloppy SAN
   * @returns the move object or null if not valid
   */
  validateMove(move, previousMove = void 0, sloppy = true) {
    return this.pgn.history.validateMove(move, previousMove, sloppy);
  }
  /**
   * Render the game as PGN with header, comments and NAGs
   * @param renderHeader optional, default true
   * @param renderComments optional, default true
   * @param renderNags optional, default true
   * @returns {string} the PGN of the game.
   */
  renderPgn(renderHeader = true, renderComments = true, renderNags = true) {
    return this.pgn.render(renderHeader, renderComments, renderNags);
  }
  /**
   * Get the position of the specified figures at a specific move
   * @param type "p", "n", "b",...
   * @param color "b" or "w"
   * @param move
   * @returns {[]} the pieces (positions) at a specific move
   */
  pieces(type = void 0, color = void 0, move = this.lastMove()) {
    const chessJs = move ? new Chess(move.fen) : new Chess(this.fen());
    let result = [];
    for (let i2 = 0; i2 < 64; i2++) {
      const square = SQUARES[i2];
      const piece = chessJs.get(square);
      if (piece) {
        piece.square = square;
      }
      if (!type) {
        if (!color && piece) {
          result.push(piece);
        }
      } else if (!color && piece && piece.type === type) {
        result.push(piece);
      } else if (piece && piece.color === color && piece.type === type) {
        result.push(piece);
      }
    }
    return result;
  }
  /**
   * get the piece on a square
   * @param square
   * @param move
   * @returns {{color: any, type: any}|null}
   */
  piece(square, move = this.lastMove()) {
    const chessJs = move ? new Chess(move.fen) : new Chess(this.fen());
    return chessJs.get(square);
  }
  /**
   * @returns {string} "b" or "w" the color to move in the main variation
   */
  turn() {
    let factor = 0;
    if (this.setUpFen()) {
      const fenParts = this.setUpFen().split(" ");
      if (fenParts[1] === COLOR2.black) {
        factor = 1;
      }
    }
    return this.pgn.history.moves.length % 2 === factor ? COLOR2.white : COLOR2.black;
  }
  /**
   * Undo a move and all moves after it
   * @param move
   */
  undo(move = this.lastMove()) {
    if (move.previous) {
      move.previous.next = void 0;
    }
    const index = move.variation.findIndex((element) => {
      return element.ply === move.ply;
    });
    move.variation = move.variation.splice(index);
    publishEvent(this.observers, { type: EVENT_TYPE.undoMove, move });
  }
  plyCount() {
    return this.history().length;
  }
  fenOfPly(plyNumber) {
    if (plyNumber > 0) {
      return this.history()[plyNumber - 1].fen;
    } else {
      return this.setUpFen();
    }
  }
  addObserver(callback) {
    this.observers.push(callback);
  }
};

// node_modules/cm-chessboard/src/model/Position.js
var FEN2 = {
  start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
  empty: "8/8/8/8/8/8/8/8"
};
var Position = class _Position {
  constructor(fen = FEN2.empty) {
    this.squares = new Array(64).fill(null);
    this.setFen(fen);
  }
  setFen(fen = FEN2.empty) {
    const parts = fen.replace(/^\s*/, "").replace(/\s*$/, "").split(/\/|\s/);
    for (let part = 0; part < 8; part++) {
      const row = parts[7 - part].replace(/\d/g, (str) => {
        const numSpaces = parseInt(str);
        let ret = "";
        for (let i2 = 0; i2 < numSpaces; i2++) {
          ret += "-";
        }
        return ret;
      });
      for (let c = 0; c < 8; c++) {
        const char = row.substring(c, c + 1);
        let piece = null;
        if (char !== "-") {
          if (char.toUpperCase() === char) {
            piece = `w${char.toLowerCase()}`;
          } else {
            piece = `b${char}`;
          }
        }
        this.squares[part * 8 + c] = piece;
      }
    }
  }
  getFen() {
    let parts = new Array(8).fill("");
    for (let part = 0; part < 8; part++) {
      let spaceCounter = 0;
      for (let i2 = 0; i2 < 8; i2++) {
        const piece = this.squares[part * 8 + i2];
        if (!piece) {
          spaceCounter++;
        } else {
          if (spaceCounter > 0) {
            parts[7 - part] += spaceCounter;
            spaceCounter = 0;
          }
          const color = piece.substring(0, 1);
          const name = piece.substring(1, 2);
          if (color === "w") {
            parts[7 - part] += name.toUpperCase();
          } else {
            parts[7 - part] += name;
          }
        }
      }
      if (spaceCounter > 0) {
        parts[7 - part] += spaceCounter;
        spaceCounter = 0;
      }
    }
    return parts.join("/");
  }
  getPieces(sortBy = ["k", "q", "r", "b", "n", "p"]) {
    const pieces = [];
    const sort = (a, b) => {
      return sortBy.indexOf(a.name) - sortBy.indexOf(b.name);
    };
    for (let i2 = 0; i2 < 64; i2++) {
      const piece = this.squares[i2];
      if (piece) {
        pieces.push({
          name: piece.charAt(1),
          color: piece.charAt(0),
          position: _Position.indexToSquare(i2)
        });
      }
    }
    if (sortBy) {
      pieces.sort(sort);
    }
    return pieces;
  }
  movePiece(squareFrom, squareTo) {
    if (!this.squares[_Position.squareToIndex(squareFrom)]) {
      console.warn("no piece on", squareFrom);
      return;
    }
    this.squares[_Position.squareToIndex(squareTo)] = this.squares[_Position.squareToIndex(squareFrom)];
    this.squares[_Position.squareToIndex(squareFrom)] = null;
  }
  setPiece(square, piece) {
    this.squares[_Position.squareToIndex(square)] = piece;
  }
  getPiece(square) {
    return this.squares[_Position.squareToIndex(square)];
  }
  static squareToIndex(square) {
    const coordinates = _Position.squareToCoordinates(square);
    return coordinates[0] + coordinates[1] * 8;
  }
  static indexToSquare(index) {
    return this.coordinatesToSquare([Math.floor(index % 8), index / 8]);
  }
  static squareToCoordinates(square) {
    const file2 = square.charCodeAt(0) - 97;
    const rank2 = square.charCodeAt(1) - 49;
    return [file2, rank2];
  }
  static coordinatesToSquare(coordinates) {
    const file2 = String.fromCharCode(coordinates[0] + 97);
    const rank2 = String.fromCharCode(coordinates[1] + 49);
    return file2 + rank2;
  }
  clone() {
    const cloned = new _Position();
    cloned.squares = this.squares.slice(0);
    return cloned;
  }
};

// node_modules/cm-chessboard/src/model/ChessboardState.js
var ChessboardState = class {
  constructor() {
    this.position = new Position();
    this.orientation = void 0;
    this.inputWhiteEnabled = false;
    this.inputBlackEnabled = false;
    this.moveInputCallback = null;
    this.extensionPoints = {};
    this.moveInputProcess = Promise.resolve();
  }
  inputEnabled() {
    return this.inputWhiteEnabled || this.inputBlackEnabled;
  }
  invokeExtensionPoints(name, data = {}) {
    const extensionPoints = this.extensionPoints[name];
    const dataCloned = Object.assign({}, data);
    dataCloned.extensionPoint = name;
    let returnValue = true;
    if (extensionPoints) {
      for (const extensionPoint of extensionPoints) {
        if (extensionPoint(dataCloned) === false) {
          returnValue = false;
        }
      }
    }
    return returnValue;
  }
};

// node_modules/cm-chessboard/src/lib/Svg.js
var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
var Svg = class {
  /**
   * create the Svg in the HTML DOM
   * @param containerElement
   * @returns {Element}
   */
  static createSvg(containerElement = void 0) {
    let svg = document.createElementNS(SVG_NAMESPACE, "svg");
    if (containerElement) {
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      containerElement.appendChild(svg);
    }
    return svg;
  }
  /**
   * Add an Element to an SVG DOM
   * @param parent
   * @param name
   * @param attributes
   * @returns {Element}
   */
  static addElement(parent, name, attributes = {}) {
    let element = document.createElementNS(SVG_NAMESPACE, name);
    if (name === "use") {
      attributes["xlink:href"] = attributes["href"];
    }
    for (let attribute in attributes) {
      if (attributes.hasOwnProperty(attribute)) {
        if (attribute.indexOf(":") !== -1) {
          const value = attribute.split(":");
          element.setAttributeNS("http://www.w3.org/1999/" + value[0], value[1], attributes[attribute]);
        } else {
          element.setAttribute(attribute, attributes[attribute]);
        }
      }
    }
    parent.appendChild(element);
    return element;
  }
  /**
   * Remove an element from an SVG DOM
   * @param element
   */
  static removeElement(element) {
    if (!element) {
      console.warn("removeElement, element is", element);
      return;
    }
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    } else {
      console.warn(element, "without parentNode");
    }
  }
};

// node_modules/cm-chessboard/src/model/Extension.js
var EXTENSION_POINT = {
  positionChanged: "positionChanged",
  // the positions of the pieces was changed
  boardChanged: "boardChanged",
  // the board (orientation) was changed
  moveInputToggled: "moveInputToggled",
  // move input was enabled or disabled
  moveInput: "moveInput",
  // move started, moving over a square, validating or canceled
  beforeRedrawBoard: "beforeRedrawBoard",
  // called before redrawing the board
  afterRedrawBoard: "afterRedrawBoard",
  // called after redrawing the board
  redrawBoard: "redrawBoard",
  // called after redrawing the board, DEPRECATED, use afterRedrawBoard 2023-09-18
  animation: "animation",
  // called on animation start, end, and on every animation frame
  destroy: "destroy"
  // called, before the board is destroyed
};
var Extension = class {
  constructor(chessboard) {
    this.chessboard = chessboard;
  }
  registerExtensionPoint(name, callback) {
    if (name === EXTENSION_POINT.redrawBoard) {
      console.warn("EXTENSION_POINT.redrawBoard is deprecated, use EXTENSION_POINT.afterRedrawBoard");
      name = EXTENSION_POINT.afterRedrawBoard;
    }
    if (!this.chessboard.state.extensionPoints[name]) {
      this.chessboard.state.extensionPoints[name] = [];
    }
    this.chessboard.state.extensionPoints[name].push(callback);
  }
  /** @deprecated 2023-05-18 */
  registerMethod(name, callback) {
    console.warn("registerMethod is deprecated, just add methods directly to the chessboard instance");
    if (!this.chessboard[name]) {
      this.chessboard[name] = (...args) => {
        return callback.apply(this, args);
      };
    } else {
      log.error("method", name, "already exists");
    }
  }
};

// node_modules/cm-chessboard/src/lib/Utils.js
var Utils = class _Utils {
  static delegate(element, eventName, selector, handler) {
    const eventListener = function(event) {
      let target = event.target;
      while (target && target !== this) {
        if (target.matches(selector)) {
          handler.call(target, event);
        }
        target = target.parentNode;
      }
    };
    element.addEventListener(eventName, eventListener);
    return {
      remove: function() {
        element.removeEventListener(eventName, eventListener);
      }
    };
  }
  static mergeObjects(target, source) {
    const isObject = (obj) => obj && typeof obj === "object";
    if (!isObject(target) || !isObject(source)) {
      return source;
    }
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object) {
        Object.assign(source[key], _Utils.mergeObjects(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  }
  static createDomElement(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }
  static createTask() {
    let resolve, reject;
    const promise = new Promise(function(_resolve, _reject) {
      resolve = _resolve;
      reject = _reject;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
  }
  static isAbsoluteUrl(url) {
    return url.indexOf("://") !== -1 || url.startsWith("/");
  }
};

// node_modules/cm-chessboard/src/view/PositionAnimationsQueue.js
var ANIMATION_EVENT_TYPE = {
  start: "start",
  frame: "frame",
  end: "end"
};
var PromiseQueue = class {
  constructor() {
    this.queue = [];
    this.workingOnPromise = false;
    this.stop = false;
  }
  async enqueue(promise) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promise,
        resolve,
        reject
      });
      this.dequeue();
    });
  }
  dequeue() {
    if (this.workingOnPromise) {
      return;
    }
    if (this.stop) {
      this.queue = [];
      this.stop = false;
      return;
    }
    const entry = this.queue.shift();
    if (!entry) {
      return;
    }
    try {
      this.workingOnPromise = true;
      entry.promise().then((value) => {
        this.workingOnPromise = false;
        entry.resolve(value);
        this.dequeue();
      }).catch((err) => {
        this.workingOnPromise = false;
        entry.reject(err);
        this.dequeue();
      });
    } catch (err) {
      this.workingOnPromise = false;
      entry.reject(err);
      this.dequeue();
    }
    return true;
  }
  destroy() {
    this.stop = true;
  }
};
var CHANGE_TYPE = {
  move: 0,
  appear: 1,
  disappear: 2
};
var PositionsAnimation = class _PositionsAnimation {
  constructor(view, fromPosition, toPosition, duration, callback) {
    this.view = view;
    if (fromPosition && toPosition) {
      this.animatedElements = this.createAnimation(fromPosition.squares, toPosition.squares);
      this.duration = duration;
      this.callback = callback;
      this.frameHandle = requestAnimationFrame(this.animationStep.bind(this));
    } else {
      console.error("fromPosition", fromPosition, "toPosition", toPosition);
    }
    this.view.positionsAnimationTask = Utils.createTask();
    this.view.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.animation, {
      type: ANIMATION_EVENT_TYPE.start
    });
  }
  static seekChanges(fromSquares, toSquares) {
    const appearedList = [], disappearedList = [], changes = [];
    for (let i2 = 0; i2 < 64; i2++) {
      const previousSquare = fromSquares[i2];
      const newSquare = toSquares[i2];
      if (newSquare !== previousSquare) {
        if (newSquare) {
          appearedList.push({ piece: newSquare, index: i2 });
        }
        if (previousSquare) {
          disappearedList.push({ piece: previousSquare, index: i2 });
        }
      }
    }
    appearedList.forEach((appeared) => {
      let shortestDistance = 8;
      let foundMoved = null;
      disappearedList.forEach((disappeared) => {
        if (appeared.piece === disappeared.piece) {
          const moveDistance = _PositionsAnimation.squareDistance(appeared.index, disappeared.index);
          if (moveDistance < shortestDistance) {
            foundMoved = disappeared;
            shortestDistance = moveDistance;
          }
        }
      });
      if (foundMoved) {
        disappearedList.splice(disappearedList.indexOf(foundMoved), 1);
        changes.push({
          type: CHANGE_TYPE.move,
          piece: appeared.piece,
          atIndex: foundMoved.index,
          toIndex: appeared.index
        });
      } else {
        changes.push({ type: CHANGE_TYPE.appear, piece: appeared.piece, atIndex: appeared.index });
      }
    });
    disappearedList.forEach((disappeared) => {
      changes.push({ type: CHANGE_TYPE.disappear, piece: disappeared.piece, atIndex: disappeared.index });
    });
    return changes;
  }
  createAnimation(fromSquares, toSquares) {
    const changes = _PositionsAnimation.seekChanges(fromSquares, toSquares);
    const animatedElements = [];
    changes.forEach((change) => {
      const animatedItem = {
        type: change.type
      };
      switch (change.type) {
        case CHANGE_TYPE.move:
          animatedItem.element = this.view.getPieceElement(Position.indexToSquare(change.atIndex));
          animatedItem.element.parentNode.appendChild(animatedItem.element);
          animatedItem.atPoint = this.view.indexToPoint(change.atIndex);
          animatedItem.toPoint = this.view.indexToPoint(change.toIndex);
          break;
        case CHANGE_TYPE.appear:
          animatedItem.element = this.view.drawPieceOnSquare(Position.indexToSquare(change.atIndex), change.piece);
          animatedItem.element.style.opacity = 0;
          break;
        case CHANGE_TYPE.disappear:
          animatedItem.element = this.view.getPieceElement(Position.indexToSquare(change.atIndex));
          break;
      }
      animatedElements.push(animatedItem);
    });
    return animatedElements;
  }
  animationStep(time) {
    if (!this.view || !this.view.chessboard.state) {
      return;
    }
    if (!this.startTime) {
      this.startTime = time;
    }
    const timeDiff = time - this.startTime;
    if (timeDiff <= this.duration) {
      this.frameHandle = requestAnimationFrame(this.animationStep.bind(this));
    } else {
      cancelAnimationFrame(this.frameHandle);
      this.animatedElements.forEach((animatedItem) => {
        if (animatedItem.type === CHANGE_TYPE.disappear) {
          Svg.removeElement(animatedItem.element);
        }
      });
      this.view.positionsAnimationTask.resolve();
      this.view.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.animation, {
        type: ANIMATION_EVENT_TYPE.end
      });
      this.callback();
      return;
    }
    const t = Math.min(1, timeDiff / this.duration);
    let progress = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    if (isNaN(progress) || progress > 0.99) {
      progress = 1;
    }
    this.animatedElements.forEach((animatedItem) => {
      if (animatedItem.element) {
        switch (animatedItem.type) {
          case CHANGE_TYPE.move:
            animatedItem.element.transform.baseVal.removeItem(0);
            const transform = this.view.svg.createSVGTransform();
            transform.setTranslate(
              animatedItem.atPoint.x + (animatedItem.toPoint.x - animatedItem.atPoint.x) * progress,
              animatedItem.atPoint.y + (animatedItem.toPoint.y - animatedItem.atPoint.y) * progress
            );
            animatedItem.element.transform.baseVal.appendItem(transform);
            break;
          case CHANGE_TYPE.appear:
            animatedItem.element.style.opacity = Math.round(progress * 100) / 100;
            break;
          case CHANGE_TYPE.disappear:
            animatedItem.element.style.opacity = Math.round((1 - progress) * 100) / 100;
            break;
        }
      } else {
        console.warn("animatedItem has no element", animatedItem);
      }
    });
    this.view.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.animation, {
      type: ANIMATION_EVENT_TYPE.frame,
      progress
    });
  }
  static squareDistance(index1, index2) {
    const file1 = index1 % 8;
    const rank1 = Math.floor(index1 / 8);
    const file2 = index2 % 8;
    const rank2 = Math.floor(index2 / 8);
    return Math.max(Math.abs(rank2 - rank1), Math.abs(file2 - file1));
  }
};
var PositionAnimationsQueue = class extends PromiseQueue {
  constructor(chessboard) {
    super();
    this.chessboard = chessboard;
  }
  async enqueuePositionChange(positionFrom, positionTo, animated) {
    if (positionFrom.getFen() === positionTo.getFen()) {
      return Promise.resolve();
    } else {
      return super.enqueue(() => new Promise((resolve) => {
        let duration = animated ? this.chessboard.props.style.animationDuration : 0;
        if (this.queue.length > 0) {
          duration = duration / (1 + Math.pow(this.queue.length / 5, 2));
        }
        new PositionsAnimation(
          this.chessboard.view,
          positionFrom,
          positionTo,
          animated ? duration : 0,
          () => {
            if (this.chessboard.view) {
              this.chessboard.view.redrawPieces(positionTo.squares);
            }
            resolve();
          }
        );
      }));
    }
  }
  async enqueueTurnBoard(position, color, animated) {
    return super.enqueue(() => new Promise((resolve) => {
      const emptyPosition = new Position(FEN2.empty);
      let duration = animated ? this.chessboard.props.style.animationDuration : 0;
      if (this.queue.length > 0) {
        duration = duration / (1 + Math.pow(this.queue.length / 5, 2));
      }
      new PositionsAnimation(
        this.chessboard.view,
        position,
        emptyPosition,
        animated ? duration : 0,
        () => {
          this.chessboard.state.orientation = color;
          this.chessboard.view.redrawBoard();
          this.chessboard.view.redrawPieces(emptyPosition.squares);
          new PositionsAnimation(
            this.chessboard.view,
            emptyPosition,
            position,
            animated ? duration : 0,
            () => {
              this.chessboard.view.redrawPieces(position.squares);
              resolve();
            }
          );
        }
      );
    }));
  }
};

// node_modules/cm-chessboard/src/view/VisualMoveInput.js
var MOVE_INPUT_STATE = {
  waitForInputStart: "waitForInputStart",
  pieceClickedThreshold: "pieceClickedThreshold",
  clickTo: "clickTo",
  secondClickThreshold: "secondClickThreshold",
  dragTo: "dragTo",
  clickDragTo: "clickDragTo",
  moveDone: "moveDone",
  reset: "reset"
};
var MOVE_CANCELED_REASON = {
  secondClick: "secondClick",
  // clicked the same piece
  secondaryClick: "secondaryClick",
  // right click while moving
  movedOutOfBoard: "movedOutOfBoard",
  draggedBack: "draggedBack",
  // dragged to the start square
  clickedAnotherPiece: "clickedAnotherPiece"
  // of the same color
};
var DRAG_THRESHOLD = 4;
var VisualMoveInput = class {
  constructor(view) {
    this.view = view;
    this.chessboard = view.chessboard;
    this.moveInputState = null;
    this.fromSquare = null;
    this.toSquare = null;
    this.setMoveInputState(MOVE_INPUT_STATE.waitForInputStart);
  }
  moveInputStartedCallback(square) {
    const result = this.view.moveInputStartedCallback(square);
    if (result) {
      this.chessboard.state.moveInputProcess = Utils.createTask();
      this.chessboard.state.moveInputProcess.then((result2) => {
        if (this.moveInputState === MOVE_INPUT_STATE.waitForInputStart || this.moveInputState === MOVE_INPUT_STATE.moveDone) {
          this.view.moveInputFinishedCallback(this.fromSquare, this.toSquare, result2);
        }
      });
    }
    return result;
  }
  movingOverSquareCallback(fromSquare, toSquare) {
    this.view.movingOverSquareCallback(fromSquare, toSquare);
  }
  validateMoveInputCallback(fromSquare, toSquare) {
    const result = this.view.validateMoveInputCallback(fromSquare, toSquare);
    this.chessboard.state.moveInputProcess.resolve(result);
    return result;
  }
  moveInputCanceledCallback(fromSquare, toSquare, reason) {
    this.view.moveInputCanceledCallback(fromSquare, toSquare, reason);
    this.chessboard.state.moveInputProcess.resolve();
  }
  setMoveInputState(newState, params = void 0) {
    const prevState = this.moveInputState;
    this.moveInputState = newState;
    switch (newState) {
      case MOVE_INPUT_STATE.waitForInputStart:
        break;
      case MOVE_INPUT_STATE.pieceClickedThreshold:
        if (MOVE_INPUT_STATE.waitForInputStart !== prevState && MOVE_INPUT_STATE.clickTo !== prevState) {
          throw new Error("moveInputState");
        }
        if (this.pointerMoveListener) {
          removeEventListener(this.pointerMoveListener.type, this.pointerMoveListener);
          this.pointerMoveListener = null;
        }
        if (this.pointerUpListener) {
          removeEventListener(this.pointerUpListener.type, this.pointerUpListener);
          this.pointerUpListener = null;
        }
        this.fromSquare = params.square;
        this.toSquare = null;
        this.movedPiece = params.piece;
        this.startPoint = params.point;
        if (!this.pointerMoveListener && !this.pointerUpListener) {
          if (params.type === "mousedown") {
            this.pointerMoveListener = this.onPointerMove.bind(this);
            this.pointerMoveListener.type = "mousemove";
            addEventListener("mousemove", this.pointerMoveListener);
            this.pointerUpListener = this.onPointerUp.bind(this);
            this.pointerUpListener.type = "mouseup";
            addEventListener("mouseup", this.pointerUpListener);
          } else if (params.type === "touchstart") {
            this.pointerMoveListener = this.onPointerMove.bind(this);
            this.pointerMoveListener.type = "touchmove";
            addEventListener("touchmove", this.pointerMoveListener);
            this.pointerUpListener = this.onPointerUp.bind(this);
            this.pointerUpListener.type = "touchend";
            addEventListener("touchend", this.pointerUpListener);
          } else {
            throw Error("4b74af");
          }
          if (!this.contextMenuListener) {
            this.contextMenuListener = this.onContextMenu.bind(this);
            this.chessboard.view.svg.addEventListener("contextmenu", this.contextMenuListener);
          }
        } else {
          throw Error("94ad0c");
        }
        break;
      case MOVE_INPUT_STATE.clickTo:
        if (this.draggablePiece) {
          Svg.removeElement(this.draggablePiece);
          this.draggablePiece = null;
        }
        if (prevState === MOVE_INPUT_STATE.dragTo) {
          this.view.setPieceVisibility(params.square, true);
        }
        break;
      case MOVE_INPUT_STATE.secondClickThreshold:
        if (MOVE_INPUT_STATE.clickTo !== prevState) {
          throw new Error("moveInputState");
        }
        this.startPoint = params.point;
        break;
      case MOVE_INPUT_STATE.dragTo:
        if (MOVE_INPUT_STATE.pieceClickedThreshold !== prevState) {
          throw new Error("moveInputState");
        }
        if (this.view.chessboard.state.inputEnabled()) {
          this.view.setPieceVisibility(params.square, false);
          this.createDraggablePiece(params.piece);
        }
        break;
      case MOVE_INPUT_STATE.clickDragTo:
        if (MOVE_INPUT_STATE.secondClickThreshold !== prevState) {
          throw new Error("moveInputState");
        }
        if (this.view.chessboard.state.inputEnabled()) {
          this.view.setPieceVisibility(params.square, false);
          this.createDraggablePiece(params.piece);
        }
        break;
      case MOVE_INPUT_STATE.moveDone:
        if ([MOVE_INPUT_STATE.dragTo, MOVE_INPUT_STATE.clickTo, MOVE_INPUT_STATE.clickDragTo].indexOf(prevState) === -1) {
          throw new Error("moveInputState");
        }
        this.toSquare = params.square;
        if (this.toSquare && this.validateMoveInputCallback(this.fromSquare, this.toSquare)) {
          this.chessboard.movePiece(this.fromSquare, this.toSquare, prevState === MOVE_INPUT_STATE.clickTo).then(() => {
            if (prevState === MOVE_INPUT_STATE.clickTo) {
              this.view.setPieceVisibility(this.toSquare, true);
            }
            this.setMoveInputState(MOVE_INPUT_STATE.reset);
          });
        } else {
          this.view.setPieceVisibility(this.fromSquare, true);
          this.setMoveInputState(MOVE_INPUT_STATE.reset);
        }
        break;
      case MOVE_INPUT_STATE.reset:
        if (this.fromSquare && !this.toSquare && this.movedPiece) {
          this.chessboard.state.position.setPiece(this.fromSquare, this.movedPiece);
        }
        this.fromSquare = null;
        this.toSquare = null;
        this.movedPiece = null;
        if (this.draggablePiece) {
          Svg.removeElement(this.draggablePiece);
          this.draggablePiece = null;
        }
        if (this.pointerMoveListener) {
          removeEventListener(this.pointerMoveListener.type, this.pointerMoveListener);
          this.pointerMoveListener = null;
        }
        if (this.pointerUpListener) {
          removeEventListener(this.pointerUpListener.type, this.pointerUpListener);
          this.pointerUpListener = null;
        }
        if (this.contextMenuListener) {
          removeEventListener("contextmenu", this.contextMenuListener);
          this.contextMenuListener = null;
        }
        this.setMoveInputState(MOVE_INPUT_STATE.waitForInputStart);
        const hiddenPieces = this.view.piecesGroup.querySelectorAll("[visibility=hidden]");
        for (let i2 = 0; i2 < hiddenPieces.length; i2++) {
          hiddenPieces[i2].removeAttribute("visibility");
        }
        break;
      default:
        throw Error(`260b09: moveInputState ${newState}`);
    }
  }
  createDraggablePiece(pieceName) {
    if (this.draggablePiece) {
      throw Error("draggablePiece already exists");
    }
    this.draggablePiece = Svg.createSvg(document.body);
    this.draggablePiece.classList.add("cm-chessboard-draggable-piece");
    this.draggablePiece.setAttribute("width", this.view.squareWidth);
    this.draggablePiece.setAttribute("height", this.view.squareHeight);
    this.draggablePiece.setAttribute("style", "pointer-events: none");
    this.draggablePiece.name = pieceName;
    const spriteUrl = this.chessboard.props.assetsCache ? "" : this.view.getSpriteUrl();
    const piece = Svg.addElement(this.draggablePiece, "use", {
      href: `${spriteUrl}#${pieceName}`
    });
    const scaling = this.view.squareHeight / this.chessboard.props.style.pieces.tileSize;
    const transformScale = this.draggablePiece.createSVGTransform();
    transformScale.setScale(scaling, scaling);
    piece.transform.baseVal.appendItem(transformScale);
  }
  moveDraggablePiece(x, y) {
    this.draggablePiece.setAttribute(
      "style",
      `pointer-events: none; position: absolute; left: ${x - this.view.squareHeight / 2}px; top: ${y - this.view.squareHeight / 2}px`
    );
  }
  onPointerDown(e) {
    if (!(e.type === "mousedown" && e.button === 0 || e.type === "touchstart")) {
      return;
    }
    const square = e.target.getAttribute("data-square");
    if (!square) {
      return;
    }
    const pieceName = this.chessboard.getPiece(square);
    let color;
    if (pieceName) {
      color = pieceName ? pieceName.substring(0, 1) : null;
      if (color === "w" && this.chessboard.state.inputWhiteEnabled || color === "b" && this.chessboard.state.inputBlackEnabled) {
        e.preventDefault();
      }
    }
    if (this.moveInputState !== MOVE_INPUT_STATE.waitForInputStart || this.chessboard.state.inputWhiteEnabled && color === "w" || this.chessboard.state.inputBlackEnabled && color === "b") {
      let point;
      if (e.type === "mousedown") {
        point = { x: e.clientX, y: e.clientY };
      } else if (e.type === "touchstart") {
        point = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      if (this.moveInputState === MOVE_INPUT_STATE.waitForInputStart && pieceName && this.moveInputStartedCallback(square)) {
        this.setMoveInputState(MOVE_INPUT_STATE.pieceClickedThreshold, {
          square,
          piece: pieceName,
          point,
          type: e.type
        });
      } else if (this.moveInputState === MOVE_INPUT_STATE.clickTo) {
        if (square === this.fromSquare) {
          this.setMoveInputState(MOVE_INPUT_STATE.secondClickThreshold, {
            square,
            piece: pieceName,
            point,
            type: e.type
          });
        } else {
          const pieceName2 = this.chessboard.getPiece(square);
          const pieceColor = pieceName2 ? pieceName2.substring(0, 1) : null;
          const startPieceName = this.chessboard.getPiece(this.fromSquare);
          const startPieceColor = startPieceName ? startPieceName.substring(0, 1) : null;
          if (color && startPieceColor === pieceColor) {
            this.moveInputCanceledCallback(this.fromSquare, square, MOVE_CANCELED_REASON.clickedAnotherPiece);
            if (this.moveInputStartedCallback(square)) {
              this.setMoveInputState(MOVE_INPUT_STATE.pieceClickedThreshold, {
                square,
                piece: pieceName2,
                point,
                type: e.type
              });
            } else {
              this.setMoveInputState(MOVE_INPUT_STATE.reset);
            }
          } else {
            this.setMoveInputState(MOVE_INPUT_STATE.moveDone, { square });
          }
        }
      }
    }
  }
  onPointerMove(e) {
    let pageX, pageY, clientX, clientY, target;
    if (e.type === "mousemove") {
      clientX = e.clientX;
      clientY = e.clientY;
      pageX = e.pageX;
      pageY = e.pageY;
      target = e.target;
    } else if (e.type === "touchmove") {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      pageX = e.touches[0].pageX;
      pageY = e.touches[0].pageY;
      target = document.elementFromPoint(clientX, clientY);
    }
    if (this.moveInputState === MOVE_INPUT_STATE.pieceClickedThreshold || this.moveInputState === MOVE_INPUT_STATE.secondClickThreshold) {
      if (Math.abs(this.startPoint.x - clientX) > DRAG_THRESHOLD || Math.abs(this.startPoint.y - clientY) > DRAG_THRESHOLD) {
        if (this.moveInputState === MOVE_INPUT_STATE.secondClickThreshold) {
          this.setMoveInputState(MOVE_INPUT_STATE.clickDragTo, {
            square: this.fromSquare,
            piece: this.movedPiece
          });
        } else {
          this.setMoveInputState(MOVE_INPUT_STATE.dragTo, { square: this.fromSquare, piece: this.movedPiece });
        }
        if (this.view.chessboard.state.inputEnabled()) {
          this.moveDraggablePiece(pageX, pageY);
        }
      }
    } else if (this.moveInputState === MOVE_INPUT_STATE.dragTo || this.moveInputState === MOVE_INPUT_STATE.clickDragTo || this.moveInputState === MOVE_INPUT_STATE.clickTo) {
      if (target && target.getAttribute && target.parentElement === this.view.boardGroup) {
        const square = target.getAttribute("data-square");
        if (square !== this.fromSquare && square !== this.toSquare) {
          this.toSquare = square;
          this.movingOverSquareCallback(this.fromSquare, this.toSquare);
        } else if (square === this.fromSquare && this.toSquare !== null) {
          this.toSquare = null;
          this.movingOverSquareCallback(this.fromSquare, null);
        }
      } else if (this.toSquare !== null) {
        this.toSquare = null;
        this.movingOverSquareCallback(this.fromSquare, null);
      }
      if (this.view.chessboard.state.inputEnabled() && (this.moveInputState === MOVE_INPUT_STATE.dragTo || this.moveInputState === MOVE_INPUT_STATE.clickDragTo)) {
        this.moveDraggablePiece(pageX, pageY);
      }
    }
  }
  onPointerUp(e) {
    let target;
    if (e.type === "mouseup") {
      target = e.target;
    } else if (e.type === "touchend") {
      target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
    if (target && target.getAttribute) {
      const square = target.getAttribute("data-square");
      if (square) {
        if (this.moveInputState === MOVE_INPUT_STATE.dragTo || this.moveInputState === MOVE_INPUT_STATE.clickDragTo) {
          if (this.fromSquare === square) {
            if (this.moveInputState === MOVE_INPUT_STATE.clickDragTo) {
              this.chessboard.state.position.setPiece(this.fromSquare, this.movedPiece);
              this.view.setPieceVisibility(this.fromSquare);
              this.moveInputCanceledCallback(square, null, MOVE_CANCELED_REASON.draggedBack);
              this.setMoveInputState(MOVE_INPUT_STATE.reset);
            } else {
              this.setMoveInputState(MOVE_INPUT_STATE.clickTo, { square });
            }
          } else {
            this.setMoveInputState(MOVE_INPUT_STATE.moveDone, { square });
          }
        } else if (this.moveInputState === MOVE_INPUT_STATE.pieceClickedThreshold) {
          this.setMoveInputState(MOVE_INPUT_STATE.clickTo, { square });
        } else if (this.moveInputState === MOVE_INPUT_STATE.secondClickThreshold) {
          this.setMoveInputState(MOVE_INPUT_STATE.reset);
          this.moveInputCanceledCallback(square, null, MOVE_CANCELED_REASON.secondClick);
        }
      } else {
        this.view.redrawPieces();
        const moveStartSquare = this.fromSquare;
        this.setMoveInputState(MOVE_INPUT_STATE.reset);
        this.moveInputCanceledCallback(moveStartSquare, null, MOVE_CANCELED_REASON.movedOutOfBoard);
      }
    } else {
      this.view.redrawPieces();
      this.setMoveInputState(MOVE_INPUT_STATE.reset);
    }
  }
  onContextMenu(e) {
    e.preventDefault();
    this.view.redrawPieces();
    this.setMoveInputState(MOVE_INPUT_STATE.reset);
    this.moveInputCanceledCallback(this.fromSquare, null, MOVE_CANCELED_REASON.secondaryClick);
  }
  isDragging() {
    return this.moveInputState === MOVE_INPUT_STATE.dragTo || this.moveInputState === MOVE_INPUT_STATE.clickDragTo;
  }
  destroy() {
    this.setMoveInputState(MOVE_INPUT_STATE.reset);
  }
};

// node_modules/cm-chessboard/src/view/ChessboardView.js
var ChessboardView = class {
  constructor(chessboard) {
    this.chessboard = chessboard;
    this.visualMoveInput = new VisualMoveInput(this);
    if (chessboard.props.assetsCache) {
      this.cacheSpriteToDiv("cm-chessboard-sprite", this.getSpriteUrl());
    }
    this.container = document.createElement("div");
    this.chessboard.context.appendChild(this.container);
    if (chessboard.props.responsive) {
      if (typeof ResizeObserver !== "undefined") {
        this.resizeObserver = new ResizeObserver(() => {
          setTimeout(() => {
            this.handleResize();
          });
        });
        this.resizeObserver.observe(this.chessboard.context);
      } else {
        this.resizeListener = this.handleResize.bind(this);
        window.addEventListener("resize", this.resizeListener);
      }
    }
    this.positionsAnimationTask = Promise.resolve();
    this.pointerDownListener = this.pointerDownHandler.bind(this);
    this.pointerDownListener = this.pointerDownHandler.bind(this);
    this.container.addEventListener("mousedown", this.pointerDownListener);
    this.container.addEventListener("touchstart", this.pointerDownListener, { passive: false });
    this.createSvgAndGroups();
    this.handleResize();
  }
  pointerDownHandler(e) {
    this.visualMoveInput.onPointerDown(e);
  }
  destroy() {
    this.visualMoveInput.destroy();
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.chessboard.context);
    }
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
    }
    this.chessboard.context.removeEventListener("mousedown", this.pointerDownListener);
    this.chessboard.context.removeEventListener("touchstart", this.pointerDownListener);
    Svg.removeElement(this.svg);
  }
  // Sprite //
  cacheSpriteToDiv(wrapperId, url) {
    if (!document.getElementById(wrapperId)) {
      const wrapper = document.createElement("div");
      wrapper.style.transform = "scale(0)";
      wrapper.style.position = "absolute";
      wrapper.setAttribute("aria-hidden", "true");
      wrapper.id = wrapperId;
      document.body.appendChild(wrapper);
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = function() {
        wrapper.insertAdjacentHTML("afterbegin", xhr.response);
      };
      xhr.send();
    }
  }
  createSvgAndGroups() {
    this.svg = Svg.createSvg(this.container);
    let cssClass = this.chessboard.props.style.cssClass ? this.chessboard.props.style.cssClass : "default";
    this.svg.setAttribute("class", "cm-chessboard border-type-" + this.chessboard.props.style.borderType + " " + cssClass);
    this.svg.setAttribute("role", "img");
    this.updateMetrics();
    this.boardGroup = Svg.addElement(this.svg, "g", { class: "board" });
    this.coordinatesGroup = Svg.addElement(this.svg, "g", { class: "coordinates", "aria-hidden": "true" });
    this.markersLayer = Svg.addElement(this.svg, "g", { class: "markers-layer" });
    this.piecesLayer = Svg.addElement(this.svg, "g", { class: "pieces-layer" });
    this.piecesGroup = Svg.addElement(this.piecesLayer, "g", { class: "pieces" });
    this.markersTopLayer = Svg.addElement(this.svg, "g", { class: "markers-top-layer" });
    this.interactiveTopLayer = Svg.addElement(this.svg, "g", { class: "interactive-top-layer" });
  }
  updateMetrics() {
    const piecesTileSize = this.chessboard.props.style.pieces.tileSize;
    this.width = this.container.clientWidth;
    this.height = this.container.clientWidth * (this.chessboard.props.style.aspectRatio || 1);
    if (this.chessboard.props.style.borderType === BORDER_TYPE.frame) {
      this.borderSize = this.width / 25;
    } else if (this.chessboard.props.style.borderType === BORDER_TYPE.thin) {
      this.borderSize = this.width / 320;
    } else {
      this.borderSize = 0;
    }
    this.innerWidth = this.width - 2 * this.borderSize;
    this.innerHeight = this.height - 2 * this.borderSize;
    this.squareWidth = this.innerWidth / 8;
    this.squareHeight = this.innerHeight / 8;
    this.scalingX = this.squareWidth / piecesTileSize;
    this.scalingY = this.squareHeight / piecesTileSize;
    this.pieceXTranslate = this.squareWidth / 2 - piecesTileSize * this.scalingY / 2;
  }
  handleResize() {
    this.container.style.width = this.chessboard.context.clientWidth + "px";
    this.container.style.height = this.chessboard.context.clientWidth * this.chessboard.props.style.aspectRatio + "px";
    if (this.container.clientWidth !== this.width || this.container.clientHeight !== this.height) {
      this.updateMetrics();
      this.redrawBoard();
      this.redrawPieces();
    }
    this.svg.setAttribute("width", "100%");
    this.svg.setAttribute("height", "100%");
  }
  redrawBoard() {
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.beforeRedrawBoard);
    this.redrawSquares();
    this.drawCoordinates();
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.afterRedrawBoard);
    this.visualizeInputState();
  }
  // Board //
  redrawSquares() {
    while (this.boardGroup.firstChild) {
      this.boardGroup.removeChild(this.boardGroup.lastChild);
    }
    let boardBorder = Svg.addElement(this.boardGroup, "rect", { width: this.width, height: this.height });
    boardBorder.setAttribute("class", "border");
    if (this.chessboard.props.style.borderType === BORDER_TYPE.frame) {
      const innerPos = this.borderSize;
      let borderInner = Svg.addElement(this.boardGroup, "rect", {
        x: innerPos,
        y: innerPos,
        width: this.width - innerPos * 2,
        height: this.height - innerPos * 2
      });
      borderInner.setAttribute("class", "border-inner");
    }
    for (let i2 = 0; i2 < 64; i2++) {
      const index = this.chessboard.state.orientation === COLOR3.white ? i2 : 63 - i2;
      const squareColor = (9 * index & 8) === 0 ? "black" : "white";
      const fieldClass = `square ${squareColor}`;
      const point = this.squareToPoint(Position.indexToSquare(index));
      const squareRect = Svg.addElement(this.boardGroup, "rect", {
        x: point.x,
        y: point.y,
        width: this.squareWidth,
        height: this.squareHeight
      });
      squareRect.setAttribute("class", fieldClass);
      squareRect.setAttribute("data-square", Position.indexToSquare(index));
    }
  }
  drawCoordinates() {
    if (!this.chessboard.props.style.showCoordinates) {
      return;
    }
    while (this.coordinatesGroup.firstChild) {
      this.coordinatesGroup.removeChild(this.coordinatesGroup.lastChild);
    }
    const inline = this.chessboard.props.style.borderType !== BORDER_TYPE.frame;
    for (let file2 = 0; file2 < 8; file2++) {
      let x = this.borderSize + (17 + this.chessboard.props.style.pieces.tileSize * file2) * this.scalingX;
      let y = this.height - this.scalingY * 3.5;
      let cssClass = "coordinate file";
      if (inline) {
        x = x + this.scalingX * 15.5;
        cssClass += file2 % 2 ? " white" : " black";
      }
      const textElement = Svg.addElement(this.coordinatesGroup, "text", {
        class: cssClass,
        x,
        y,
        style: `font-size: ${this.scalingY * 10}px`
      });
      if (this.chessboard.state.orientation === COLOR3.white) {
        textElement.textContent = String.fromCharCode(97 + file2);
      } else {
        textElement.textContent = String.fromCharCode(104 - file2);
      }
    }
    for (let rank2 = 0; rank2 < 8; rank2++) {
      let x = this.borderSize / 3.7;
      let y = this.borderSize + 25 * this.scalingY + rank2 * this.squareHeight;
      let cssClass = "coordinate rank";
      if (inline) {
        cssClass += rank2 % 2 ? " black" : " white";
        if (this.chessboard.props.style.borderType === BORDER_TYPE.frame) {
          x = x + this.scalingX * 10;
          y = y - this.scalingY * 15;
        } else {
          x = x + this.scalingX * 2;
          y = y - this.scalingY * 15;
        }
      }
      const textElement = Svg.addElement(this.coordinatesGroup, "text", {
        class: cssClass,
        x,
        y,
        style: `font-size: ${this.scalingY * 10}px`
      });
      if (this.chessboard.state.orientation === COLOR3.white) {
        textElement.textContent = "" + (8 - rank2);
      } else {
        textElement.textContent = "" + (1 + rank2);
      }
    }
  }
  // Pieces //
  redrawPieces(squares = this.chessboard.state.position.squares) {
    const childNodes = Array.from(this.piecesGroup.childNodes);
    const isDragging = this.visualMoveInput.isDragging();
    for (let i2 = 0; i2 < 64; i2++) {
      const pieceName = squares[i2];
      if (pieceName) {
        const square = Position.indexToSquare(i2);
        this.drawPieceOnSquare(square, pieceName, isDragging && square === this.visualMoveInput.fromSquare);
      }
    }
    for (const childNode of childNodes) {
      this.piecesGroup.removeChild(childNode);
    }
  }
  drawPiece(parentGroup, pieceName, point) {
    const pieceGroup = Svg.addElement(parentGroup, "g", {});
    pieceGroup.setAttribute("data-piece", pieceName);
    const transform = this.svg.createSVGTransform();
    transform.setTranslate(point.x, point.y);
    pieceGroup.transform.baseVal.appendItem(transform);
    const spriteUrl = this.chessboard.props.assetsCache ? "" : this.getSpriteUrl();
    const pieceUse = Svg.addElement(pieceGroup, "use", {
      href: `${spriteUrl}#${pieceName}`,
      class: "piece"
    });
    const transformScale = this.svg.createSVGTransform();
    transformScale.setScale(this.scalingY, this.scalingY);
    pieceUse.transform.baseVal.appendItem(transformScale);
    return pieceGroup;
  }
  drawPieceOnSquare(square, pieceName, hidden = false) {
    const pieceGroup = Svg.addElement(this.piecesGroup, "g", {});
    pieceGroup.setAttribute("data-piece", pieceName);
    pieceGroup.setAttribute("data-square", square);
    if (hidden) {
      pieceGroup.setAttribute("visibility", "hidden");
    }
    const point = this.squareToPoint(square);
    const transform = this.svg.createSVGTransform();
    transform.setTranslate(point.x, point.y);
    pieceGroup.transform.baseVal.appendItem(transform);
    const spriteUrl = this.chessboard.props.assetsCache ? "" : this.getSpriteUrl();
    const pieceUse = Svg.addElement(pieceGroup, "use", {
      href: `${spriteUrl}#${pieceName}`,
      class: "piece"
    });
    const transformTranslate = this.svg.createSVGTransform();
    transformTranslate.setTranslate(this.pieceXTranslate, 0);
    pieceUse.transform.baseVal.appendItem(transformTranslate);
    const transformScale = this.svg.createSVGTransform();
    transformScale.setScale(this.scalingY, this.scalingY);
    pieceUse.transform.baseVal.appendItem(transformScale);
    return pieceGroup;
  }
  setPieceVisibility(square, visible = true) {
    const piece = this.getPieceElement(square);
    if (piece) {
      if (visible) {
        piece.setAttribute("visibility", "visible");
      } else {
        piece.setAttribute("visibility", "hidden");
      }
    } else {
      console.warn("no piece on", square);
    }
  }
  getPieceElement(square) {
    if (!square || square.length < 2) {
      console.warn("invalid square", square);
      return null;
    }
    const piece = this.piecesGroup.querySelector(`g[data-square='${square}']`);
    if (!piece) {
      console.warn("no piece on", square);
      return null;
    }
    return piece;
  }
  // enable and disable move input //
  enableMoveInput(eventHandler, color = null) {
    if (this.chessboard.state.moveInputCallback) {
      throw Error("moveInput already enabled");
    }
    if (color === COLOR3.white) {
      this.chessboard.state.inputWhiteEnabled = true;
    } else if (color === COLOR3.black) {
      this.chessboard.state.inputBlackEnabled = true;
    } else {
      this.chessboard.state.inputWhiteEnabled = true;
      this.chessboard.state.inputBlackEnabled = true;
    }
    this.chessboard.state.moveInputCallback = eventHandler;
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInputToggled, { enabled: true, color });
    this.visualizeInputState();
  }
  disableMoveInput() {
    this.chessboard.state.inputWhiteEnabled = false;
    this.chessboard.state.inputBlackEnabled = false;
    this.chessboard.state.moveInputCallback = null;
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInputToggled, { enabled: false });
    this.visualizeInputState();
  }
  // callbacks //
  moveInputStartedCallback(square) {
    const data = {
      chessboard: this.chessboard,
      type: INPUT_EVENT_TYPE.moveInputStarted,
      square,
      /** square is deprecated, use squareFrom (2023-05-22) */
      squareFrom: square,
      piece: this.chessboard.getPiece(square)
    };
    if (this.chessboard.state.moveInputCallback) {
      data.moveInputCallbackResult = this.chessboard.state.moveInputCallback(data);
    }
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInput, data);
    return data.moveInputCallbackResult;
  }
  movingOverSquareCallback(squareFrom, squareTo) {
    const data = {
      chessboard: this.chessboard,
      type: INPUT_EVENT_TYPE.movingOverSquare,
      squareFrom,
      squareTo,
      piece: this.chessboard.getPiece(squareFrom)
    };
    if (this.chessboard.state.moveInputCallback) {
      data.moveInputCallbackResult = this.chessboard.state.moveInputCallback(data);
    }
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInput, data);
  }
  validateMoveInputCallback(squareFrom, squareTo) {
    const data = {
      chessboard: this.chessboard,
      type: INPUT_EVENT_TYPE.validateMoveInput,
      squareFrom,
      squareTo,
      piece: this.chessboard.getPiece(squareFrom)
    };
    if (this.chessboard.state.moveInputCallback) {
      data.moveInputCallbackResult = this.chessboard.state.moveInputCallback(data);
    }
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInput, data);
    return data.moveInputCallbackResult;
  }
  moveInputCanceledCallback(squareFrom, squareTo, reason) {
    const data = {
      chessboard: this.chessboard,
      type: INPUT_EVENT_TYPE.moveInputCanceled,
      reason,
      squareFrom,
      squareTo
    };
    if (this.chessboard.state.moveInputCallback) {
      this.chessboard.state.moveInputCallback(data);
    }
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInput, data);
  }
  moveInputFinishedCallback(squareFrom, squareTo, legalMove) {
    const data = {
      chessboard: this.chessboard,
      type: INPUT_EVENT_TYPE.moveInputFinished,
      squareFrom,
      squareTo,
      legalMove
    };
    if (this.chessboard.state.moveInputCallback) {
      this.chessboard.state.moveInputCallback(data);
    }
    this.chessboard.state.invokeExtensionPoints(EXTENSION_POINT.moveInput, data);
  }
  // Helpers //
  visualizeInputState() {
    if (this.chessboard.state) {
      if (this.chessboard.state.inputWhiteEnabled || this.chessboard.state.inputBlackEnabled) {
        this.boardGroup.setAttribute("class", "board input-enabled");
      } else {
        this.boardGroup.setAttribute("class", "board");
      }
    }
  }
  indexToPoint(index) {
    let x, y;
    if (this.chessboard.state.orientation === COLOR3.white) {
      x = this.borderSize + index % 8 * this.squareWidth;
      y = this.borderSize + (7 - Math.floor(index / 8)) * this.squareHeight;
    } else {
      x = this.borderSize + (7 - index % 8) * this.squareWidth;
      y = this.borderSize + Math.floor(index / 8) * this.squareHeight;
    }
    return { x, y };
  }
  squareToPoint(square) {
    const index = Position.squareToIndex(square);
    return this.indexToPoint(index);
  }
  getSpriteUrl() {
    if (Utils.isAbsoluteUrl(this.chessboard.props.style.pieces.file)) {
      return this.chessboard.props.style.pieces.file;
    } else {
      return this.chessboard.props.assetsUrl + this.chessboard.props.style.pieces.file;
    }
  }
};

// node_modules/cm-chessboard/src/Chessboard.js
var COLOR3 = {
  white: "w",
  black: "b"
};
var INPUT_EVENT_TYPE = {
  moveInputStarted: "moveInputStarted",
  movingOverSquare: "movingOverSquare",
  // while dragging or hover after click
  validateMoveInput: "validateMoveInput",
  moveInputCanceled: "moveInputCanceled",
  moveInputFinished: "moveInputFinished"
};
var BORDER_TYPE = {
  none: "none",
  // no border
  thin: "thin",
  // thin border
  frame: "frame"
  // wide border with coordinates in it
};
var PIECE = {
  wp: "wp",
  wb: "wb",
  wn: "wn",
  wr: "wr",
  wq: "wq",
  wk: "wk",
  bp: "bp",
  bb: "bb",
  bn: "bn",
  br: "br",
  bq: "bq",
  bk: "bk"
};
var PIECES_FILE_TYPE = {
  svgSprite: "svgSprite"
};
var Chessboard = class {
  constructor(context, props = {}) {
    if (!context) {
      throw new Error("container element is " + context);
    }
    this.context = context;
    this.id = (Math.random() + 1).toString(36).substring(2, 8);
    this.extensions = [];
    this.props = {
      position: FEN2.empty,
      // set position as fen, use FEN.start or FEN.empty as shortcuts
      orientation: COLOR3.white,
      // white on bottom
      responsive: true,
      // resize the board automatically to the size of the context element
      assetsUrl: "./assets/",
      // put all css and sprites in this folder, will be ignored for absolute urls of assets files
      assetsCache: true,
      // cache the sprites, deactivate if you want to use multiple pieces sets in one page
      style: {
        cssClass: "default",
        // set the css theme of the board, try "green", "blue" or "chess-club"
        showCoordinates: true,
        // show ranks and files
        borderType: BORDER_TYPE.none,
        // "thin" thin border, "frame" wide border with coordinates in it, "none" no border
        aspectRatio: 1,
        // height/width of the board
        pieces: {
          type: PIECES_FILE_TYPE.svgSprite,
          // pieces are in an SVG sprite, no other type supported for now
          file: "pieces/standard.svg",
          // the filename of the sprite in `assets/pieces/` or an absolute url like `https://…` or `/…`
          tileSize: 40
          // the tile size in the sprite
        },
        animationDuration: 300
        // pieces animation duration in milliseconds. Disable all animations with `0`
      },
      extensions: [
        /* {class: ExtensionClass, props: { ... }} */
      ]
      // add extensions here
    };
    Utils.mergeObjects(this.props, props);
    this.state = new ChessboardState();
    this.view = new ChessboardView(this);
    this.positionAnimationsQueue = new PositionAnimationsQueue(this);
    this.state.orientation = this.props.orientation;
    for (const extensionData of this.props.extensions) {
      this.addExtension(extensionData.class, extensionData.props);
    }
    this.view.redrawBoard();
    this.state.position = new Position(this.props.position);
    this.view.redrawPieces();
    this.state.invokeExtensionPoints(EXTENSION_POINT.positionChanged);
    this.initialized = Promise.resolve();
  }
  // API //
  async setPiece(square, piece, animated = false) {
    const positionFrom = this.state.position.clone();
    this.state.position.setPiece(square, piece);
    this.state.invokeExtensionPoints(EXTENSION_POINT.positionChanged);
    return this.positionAnimationsQueue.enqueuePositionChange(positionFrom, this.state.position.clone(), animated);
  }
  async movePiece(squareFrom, squareTo, animated = false) {
    const positionFrom = this.state.position.clone();
    this.state.position.movePiece(squareFrom, squareTo);
    this.state.invokeExtensionPoints(EXTENSION_POINT.positionChanged);
    return this.positionAnimationsQueue.enqueuePositionChange(positionFrom, this.state.position.clone(), animated);
  }
  async setPosition(fen, animated = false) {
    const positionFrom = this.state.position.clone();
    const positionTo = new Position(fen);
    if (positionFrom.getFen() !== positionTo.getFen()) {
      this.state.position.setFen(fen);
      this.state.invokeExtensionPoints(EXTENSION_POINT.positionChanged);
    }
    return this.positionAnimationsQueue.enqueuePositionChange(positionFrom, this.state.position.clone(), animated);
  }
  async setOrientation(color, animated = false) {
    const position = this.state.position.clone();
    if (this.boardTurning) {
      console.warn("setOrientation is only once in queue allowed");
      return;
    }
    this.boardTurning = true;
    return this.positionAnimationsQueue.enqueueTurnBoard(position, color, animated).then(() => {
      this.boardTurning = false;
      this.state.invokeExtensionPoints(EXTENSION_POINT.boardChanged);
    });
  }
  getPiece(square) {
    return this.state.position.getPiece(square);
  }
  getPosition() {
    return this.state.position.getFen();
  }
  getOrientation() {
    return this.state.orientation;
  }
  enableMoveInput(eventHandler, color = void 0) {
    this.view.enableMoveInput(eventHandler, color);
  }
  disableMoveInput() {
    this.view.disableMoveInput();
  }
  addExtension(extensionClass, props) {
    if (this.getExtension(extensionClass)) {
      throw Error('extension "' + extensionClass.name + '" already added');
    }
    this.extensions.push(new extensionClass(this, props));
  }
  getExtension(extensionClass) {
    for (const extension of this.extensions) {
      if (extension instanceof extensionClass) {
        return extension;
      }
    }
    return null;
  }
  destroy() {
    this.state.invokeExtensionPoints(EXTENSION_POINT.destroy);
    this.positionAnimationsQueue.destroy();
    this.view.destroy();
    this.view = void 0;
    this.state = void 0;
  }
};

// node_modules/cm-web-modules/src/i18n/I18n.js
var I18n = class {
  constructor(props = {}) {
    this.props = {
      locale: null,
      fallbackLang: "en"
      // used, when the translation was not found for locale
    };
    Object.assign(this.props, props);
    this.locale = this.props.locale;
    if (!this.locale) {
      const htmlLang = document.documentElement.getAttribute("lang");
      if (htmlLang) {
        this.locale = htmlLang;
      }
      if (!this.locale) {
        this.locale = navigator.language;
      }
    }
    this.lang = this.locale.substr(0, 2);
    this.translations = {};
  }
  load(dictionary) {
    let fetchPromises = [];
    for (const lang in dictionary) {
      if (dictionary.hasOwnProperty(lang)) {
        if (!this.translations[lang]) {
          this.translations[lang] = {};
        }
        const translations2 = dictionary[lang];
        if (typeof translations2 === "string") {
          fetchPromises.push(new Promise((resolve) => {
            fetch(translations2).then((res) => res.json()).then((json) => {
              Object.assign(this.translations[lang], json);
              resolve();
            }).catch((err) => {
              throw err;
            });
          }));
        } else {
          Object.assign(this.translations[lang], translations2);
        }
      }
    }
    if (fetchPromises.length > 0) {
      return Promise.all(fetchPromises);
    } else {
      return Promise.resolve();
    }
  }
  t(code, ...values) {
    let translation;
    if (this.translations[this.locale] && this.translations[this.locale][code]) {
      translation = this.translations[this.locale][code];
    } else if (this.translations[this.lang] && this.translations[this.lang][code]) {
      translation = this.translations[this.lang][code];
    } else if (this.translations[this.props.fallbackLang][code]) {
      translation = this.translations[this.props.fallbackLang][code];
    } else {
      console.warn(
        "Error, no translation found for locale:",
        this.locale,
        ", lang: ",
        this.lang,
        ", code: ",
        code
      );
      return "?" + code + "?";
    }
    if (values && values.length > 0) {
      let i2 = 0;
      for (const value of values) {
        translation = translation.replace(new RegExp("\\$" + i2, "g"), value);
        i2++;
      }
    }
    return translation;
  }
};

// node_modules/cm-web-modules/src/message-broker/MessageBroker.js
var MessageBroker = class {
  constructor() {
    this.topics = [];
  }
  subscribe(topic, callback) {
    if (!topic) {
      const message = "subscribe: topic needed";
      console.error(message, callback);
      throw new Error(message);
    }
    if (!callback) {
      const message = "subscribe: callback needed";
      console.error(message, topic);
      throw new Error(message);
    }
    if (this.topics[topic] === void 0) {
      this.topics[topic] = [];
    }
    if (this.topics[topic].indexOf(callback) === -1) {
      this.topics[topic].push(callback);
    }
  }
  unsubscribe(topic = null, callback = null) {
    if (callback !== null && topic !== null) {
      this.topics[topic].splice(this.topics[topic].indexOf(callback), 1);
    } else if (callback === null && topic !== null) {
      this.topics[topic] = [];
    } else if (topic === null && callback !== null) {
      for (const topicName in this.topics) {
        const topic2 = this.topics[topicName];
        for (const topicSubscriber of topic2) {
          if (topicSubscriber === callback) {
            this.unsubscribe(topicName, callback);
          }
        }
      }
    } else {
      this.topics = [];
    }
    if (topic !== null) {
      if (this.topics[topic] && this.topics[topic].length === 0) {
        delete this.topics[topic];
      }
    }
  }
  publish(topic, object = {}, async = true) {
    if (!topic) {
      const message = "publish: topic needed";
      console.error(message, object);
      throw new Error(message);
    }
    const breadcrumbArray = topic.split("/");
    let wildcardTopic = "";
    for (const topicPart of breadcrumbArray) {
      this.callback(wildcardTopic + "#", topic, object, async);
      wildcardTopic += topicPart + "/";
    }
    this.callback(topic, topic, object, async);
  }
  callback(wildcardTopic, topic, object = {}, async = true) {
    if (this.topics[wildcardTopic]) {
      this.topics[wildcardTopic].forEach(function(callback) {
        if (async) {
          setTimeout(function() {
            callback(object, topic);
          });
        } else {
          return callback(object, topic);
        }
      });
    }
  }
};

// node_modules/cm-web-modules/src/utils/DomUtils.js
var DomUtils = class {
  static onDocumentReady(callback) {
    this.documentReady(callback);
  }
  /** @deprecated 2023-05-31 use onDocumentReady() */
  static documentReady(callback) {
    document.addEventListener("DOMContentLoaded", callback);
    if (document.readyState === "interactive" || document.readyState === "complete") {
      document.removeEventListener("DOMContentLoaded", callback);
      callback();
    }
  }
  // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
  static isElementVisible(element) {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  }
  // https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
  static isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  }
  static getFormInputValues(context) {
    const inputs = context.querySelectorAll("input,select");
    const values = {};
    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        values[input.id] = !!input.checked;
      } else {
        values[input.id] = input.value;
      }
    });
    return values;
  }
  static isBrowserDarkMode() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  static browserSupportsPreferredColorScheme() {
    return window.matchMedia && (window.matchMedia("(prefers-color-scheme: dark)").matches || window.matchMedia("(prefers-color-scheme: light)").matches);
  }
  static loadJs(src) {
    const element = document.createElement("script");
    element.setAttribute("type", "text/javascript");
    element.setAttribute("src", src);
    document.getElementsByTagName("head")[0].appendChild(element);
  }
  static loadCss(src) {
    const element = document.createElement("link");
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("type", "text/css");
    element.setAttribute("href", src);
    document.getElementsByTagName("head")[0].appendChild(element);
  }
  static setCustomProperty(name, value, element = document.documentElement) {
    element.style.setProperty("--" + name, value.trim());
  }
  static getCustomProperty(name, element = document.documentElement) {
    return getComputedStyle(element).getPropertyValue("--" + name).trim();
  }
  static createElement(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }
  static removeElement(element) {
    element.parentNode.removeChild(element);
  }
  static clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
  static insertAfter(newChild, refChild) {
    refChild.parentNode.insertBefore(newChild, refChild.nextSibling);
  }
  static delegate(element, eventName, selector, handler) {
    const eventListener = function(event) {
      let target = event.target;
      while (target && target !== this) {
        if (target.matches(selector)) {
          handler.call(target, event);
        }
        target = target.parentNode;
      }
    };
    element.addEventListener(eventName, eventListener);
    return {
      remove: function() {
        element.removeEventListener(eventName, eventListener);
      }
    };
  }
  static openExternalLinksBlank() {
    const links = document.links;
    for (let i2 = 0; i2 < links.length; i2++) {
      const target = links[i2].target;
      if (links[i2].hostname !== window.location.hostname && target !== "_self") {
        links[i2].target = "_blank";
      }
    }
  }
};

// node_modules/cm-web-modules/src/app/Component.js
var Component = class {
  constructor(props = {}, state = {}) {
    this.props = props;
    this.state = state;
  }
};
var UiComponent = class extends Component {
  constructor(context, props = {}, state = {}) {
    super(props, state);
    this.context = context;
    this.actions = {};
  }
  /**
   * Searches for "data-event-listener" attributes in the HTML, and couples them with actions.
   * Tag Attributes:
   *  - `data-event-listener`: The event "click", "change",...
   *  - `data-action`: The action in this.actions, called on the event
   *  - `data-delegate`: Query selector, to delegate the event from a child element
   */
  addDataEventListeners(context = this.context) {
    const eventListenerElements = context.querySelectorAll("[data-event-listener]");
    if (this.props.debug) {
      console.log("eventListenerElements", context, eventListenerElements);
    }
    for (const eventListenerElement of eventListenerElements) {
      const eventName = eventListenerElement.dataset.eventListener;
      const action = eventListenerElement.dataset.action;
      const delegate = eventListenerElement.dataset.delegate;
      if (!this.actions[action]) {
        console.error(context, 'You have to add the action "' + action + '" to your component.');
      }
      if (delegate) {
        DomUtils.delegate(eventListenerElement, eventName, delegate, (target) => {
          if (this.props.debug) {
            console.log("delegate", action, target);
          }
          this.actions[action](target);
        });
      } else {
        if (this.props.debug) {
          console.log("addEventListener", eventName, action);
        }
        if (!this.actions[action]) {
          console.error("no action", '"' + action + '"', "is defined");
        } else {
          eventListenerElement.addEventListener(eventName, this.actions[action].bind(this));
        }
      }
    }
    return this;
  }
};

// node_modules/cm-chessboard/src/extensions/accessibility/I18n.js
var piecesTranslations = {
  en: {
    colors: {
      w: "w",
      b: "b"
    },
    colors_long: {
      w: "White",
      b: "Black"
    },
    pieces: {
      p: "p",
      n: "n",
      b: "b",
      r: "r",
      q: "q",
      k: "k"
    },
    pieces_long: {
      p: "Pawn",
      n: "Knight",
      b: "Bishop",
      r: "Rook",
      q: "Queen",
      k: "King"
    }
  },
  de: {
    colors: {
      w: "w",
      b: "s"
    },
    colors_long: {
      w: "Wei\xDF",
      b: "Schwarz"
    },
    pieces: {
      p: "b",
      n: "s",
      b: "l",
      r: "t",
      q: "d",
      k: "k"
    },
    pieces_long: {
      p: "Bauer",
      n: "Springer",
      b: "L\xE4ufer",
      r: "Turm",
      q: "Dame",
      k: "K\xF6nig"
    }
  }
};
function renderPieceTitle(lang, name, color = void 0) {
  let title = piecesTranslations[lang].pieces_long[name];
  if (color) {
    title += " " + piecesTranslations[lang].colors_long[color];
  }
  return title;
}

// node_modules/cm-web-modules/src/observe/Observe.js
var collectionMutationMethods = {
  array: ["copyWithin", "fill", "pop", "push", "reverse", "shift", "unshift", "sort", "splice"],
  set: ["add", "clear", "delete"],
  map: ["set", "clear", "delete"]
};
var registry = /* @__PURE__ */ new Map();
var Observe = class _Observe {
  /**
   * Intercept a function call before the function is executed. Can manipulate
   * arguments in callback.
   * @param object
   * @param functionName allows multiple names as array
   * @param callback
   * @returns Object with `remove` function to remove the interceptor
   */
  static preFunction(object, functionName, callback) {
    if (Array.isArray(functionName)) {
      let removes = [];
      functionName.forEach((functionNameItem) => {
        removes.push(_Observe.preFunction(object, functionNameItem, callback));
      });
      return {
        remove: () => {
          removes.forEach((remove) => {
            remove.remove();
          });
        }
      };
    }
    if (!registry.has(object)) {
      registry.set(object, {});
    }
    const registryObject = registry.get(object);
    if (registryObject.observedPreFunctions === void 0) {
      registryObject.observedPreFunctions = /* @__PURE__ */ new Map();
    }
    if (!registryObject.observedPreFunctions.has(functionName)) {
      registryObject.observedPreFunctions.set(functionName, /* @__PURE__ */ new Set());
      const originalMethod = object[functionName];
      object[functionName] = function() {
        let functionArguments = arguments;
        registryObject.observedPreFunctions.get(functionName).forEach(function(callback2) {
          const params = { functionName, arguments: functionArguments };
          const callbackReturn = callback2(params);
          if (callbackReturn) {
            functionArguments = callbackReturn;
          }
        });
        return originalMethod.apply(object, functionArguments);
      };
    }
    registryObject.observedPreFunctions.get(functionName).add(callback);
    return {
      remove: () => {
        registryObject.observedPreFunctions.get(functionName).delete(callback);
      }
    };
  }
  /**
   * Intercept a function call after the function is executed. Can manipulate
   * returnValue in callback.
   * @param object
   * @param functionName allows multiple names as array
   * @param callback
   * @returns Object with `remove` function to remove the interceptor
   */
  static postFunction(object, functionName, callback) {
    if (Array.isArray(functionName)) {
      let removes = [];
      functionName.forEach((functionNameItem) => {
        removes.push(_Observe.postFunction(object, functionNameItem, callback));
      });
      return {
        remove: () => {
          removes.forEach((remove) => {
            remove.remove();
          });
        }
      };
    }
    if (!registry.has(object)) {
      registry.set(object, {});
    }
    const registryObject = registry.get(object);
    if (registryObject.observedPostFunctions === void 0) {
      registryObject.observedPostFunctions = /* @__PURE__ */ new Map();
    }
    if (!registryObject.observedPostFunctions.has(functionName)) {
      registryObject.observedPostFunctions.set(functionName, /* @__PURE__ */ new Set());
      const originalMethod = object[functionName];
      object[functionName] = function() {
        let returnValue = originalMethod.apply(object, arguments);
        const functionArguments = arguments;
        registryObject.observedPostFunctions.get(functionName).forEach(function(callback2) {
          const params = { functionName, arguments: functionArguments, returnValue };
          callback2(params);
          returnValue = params.returnValue;
        });
        return returnValue;
      };
    }
    registryObject.observedPostFunctions.get(functionName).add(callback);
    return {
      remove: () => {
        registryObject.observedPostFunctions.get(functionName).delete(callback);
      }
    };
  }
  /**
   * Observe properties (attributes) of an object. Works also with Arrays, Maps and Sets.
   * The parameter `propertyName` can be an array of names to observe multiple properties.
   * @param object
   * @param propertyName allows multiple names as array
   * @param callback
   */
  static property(object, propertyName, callback) {
    if (Array.isArray(propertyName)) {
      let removes = [];
      propertyName.forEach((propertyNameItem) => {
        removes.push(_Observe.property(object, propertyNameItem, callback));
      });
      return {
        remove: () => {
          removes.forEach((remove) => {
            remove.remove();
          });
        }
      };
    }
    if (!object.hasOwnProperty(propertyName)) {
      console.error("Observe.property", object, "missing property: " + propertyName);
      return;
    }
    let isCollection = false;
    if (!registry.has(object)) {
      registry.set(object, {});
    }
    const registryObject = registry.get(object);
    if (registryObject.observedProperties === void 0) {
      registryObject.observedProperties = /* @__PURE__ */ new Map();
    }
    if (!registryObject.observedProperties.has(propertyName)) {
      registryObject.observedProperties.set(propertyName, {
        value: object[propertyName],
        observers: /* @__PURE__ */ new Set()
      });
      const property = object[propertyName];
      let mutationMethods = [];
      if (property instanceof Array) {
        isCollection = true;
        mutationMethods = collectionMutationMethods.array;
      } else if (property instanceof Set || property instanceof WeakSet) {
        isCollection = true;
        mutationMethods = collectionMutationMethods.set;
      } else if (property instanceof Map || property instanceof WeakMap) {
        isCollection = true;
        mutationMethods = collectionMutationMethods.map;
      }
      if (delete object[propertyName]) {
        Object.defineProperty(object, propertyName, {
          get: function() {
            return registryObject.observedProperties.get(propertyName).value;
          },
          set: function(newValue) {
            const oldValue = registryObject.observedProperties.get(propertyName).value;
            if (newValue !== oldValue) {
              registryObject.observedProperties.get(propertyName).value = newValue;
              registryObject.observedProperties.get(propertyName).observers.forEach(function(callback2) {
                const params = { propertyName, oldValue, newValue };
                callback2(params);
              });
            }
          },
          enumerable: true,
          configurable: true
        });
        if (isCollection) {
          mutationMethods.forEach(function(methodName) {
            object[propertyName][methodName] = function() {
              object[propertyName].constructor.prototype[methodName].apply(this, arguments);
              const methodArguments = arguments;
              registryObject.observedProperties.get(propertyName).observers.forEach(function(observer) {
                const params = {
                  propertyName,
                  methodName,
                  arguments: methodArguments,
                  newValue: object[propertyName]
                };
                observer(params);
              });
            };
          });
        }
      } else {
        console.error("Error: Observe.property", propertyName, "failed");
      }
    }
    registryObject.observedProperties.get(propertyName).observers.add(callback);
    return {
      remove: () => {
        registryObject.observedProperties.get(propertyName).observers.delete(callback);
      }
    };
  }
};

// node_modules/chess-console/src/ChessConsoleState.js
var ChessConsoleState = class {
  constructor(props) {
    this.chess = new Chess2();
    this.orientation = props.playerColor || COLOR3.white;
    this.plyViewed = void 0;
  }
  observeChess(callback) {
    const chessManipulationMethods = [
      "move",
      "clear",
      "load",
      "loadPgn",
      "put",
      "remove",
      "reset",
      "undo"
    ];
    chessManipulationMethods.forEach((methodName) => {
      Observe.postFunction(this.chess, methodName, (params) => {
        callback(params);
      });
    });
  }
};

// node_modules/chess-console/src/ChessConsole.js
var CONSOLE_MESSAGE_TOPICS = {
  newGame: "game/new",
  // if a new game was startet
  initGame: "game/init",
  // after a page reload and when a new game was started
  gameOver: "game/over",
  moveRequest: "game/moveRequest",
  legalMove: "game/move/legal",
  illegalMove: "game/move/illegal",
  moveUndone: "game/move/undone",
  // mainly for sound
  load: "game/load"
};
var ChessConsole = class extends UiComponent {
  constructor(context, player, opponent, props = {}, state = new ChessConsoleState(props)) {
    super(context, props, state);
    this.props = {
      locale: navigator.language,
      // locale for i18n
      playerColor: COLOR3.white,
      // the players color (color at bottom)
      pgn: void 0,
      // initial pgn, can contain header and history
      accessible: false
      // render additional information to improve the usage for people using screen readers (beta)
    };
    if (!this.props.figures) {
      this.props.figures = {
        Rw: '<i class="fas fa-fw fa-chess-rook fa-figure-white"></i>',
        Nw: '<i class="fas fa-fw fa-chess-knight fa-figure-white"></i>',
        Bw: '<i class="fas fa-fw fa-chess-bishop fa-figure-white"></i>',
        Qw: '<i class="fas fa-fw fa-chess-queen fa-figure-white"></i>',
        Kw: '<i class="fas fa-fw fa-chess-king fa-figure-white"></i>',
        Pw: '<i class="fas fa-fw fa-chess-pawn fa-figure-white"></i>',
        Rb: '<i class="fas fa-fw fa-chess-rook fa-figure-black"></i>',
        Nb: '<i class="fas fa-fw fa-chess-knight fa-figure-black"></i>',
        Bb: '<i class="fas fa-fw fa-chess-bishop fa-figure-black"></i>',
        Qb: '<i class="fas fa-fw fa-chess-queen fa-figure-black"></i>',
        Kb: '<i class="fas fa-fw fa-chess-king fa-figure-black"></i>',
        Pb: '<i class="fas fa-fw fa-chess-pawn fa-figure-black"></i>'
      };
    }
    const colSets = {
      consoleGame: "col-xl-7 order-xl-2 col-lg-8 order-lg-1 order-md-1 col-md-12",
      consoleRight: "col-xl-3 order-xl-3 col-lg-4 order-lg-2 col-md-8 order-md-3",
      consoleLeft: "col-xl-2 order-xl-1 order-lg-3 col-lg-12 col-md-4 order-md-2"
    };
    this.initialized = new Promise((resolve) => {
      this.i18n = new I18n({ locale: props.locale });
      this.i18n.load({
        de: {
          ok: "OK",
          cancel: "Abbrechen"
        },
        en: {
          ok: "OK",
          cancel: "Cancel"
        }
      }).then(() => {
        this.i18n.load(piecesTranslations).then(() => {
          resolve(this);
        });
      });
    });
    this.initialization = this.initialized;
    if (!this.props.template) {
      this.props.template = `
                <div class="row chess-console">
                    <div class="chess-console-center ${colSets.consoleGame}">
                        <div class="chess-console-board"></div>
                    </div>
                    <div class="chess-console-right ${colSets.consoleRight}">
                        <div class="control-buttons buttons-grid mb-4"></div>
                        <div class="chess-console-notifications"></div>
                    </div>
                    <div class="chess-console-left ${colSets.consoleLeft}">
                        <div class="row">
                            <div class="col-xl-12 col-lg-4 col-md-12 col-6">
                                <div class="chess-console-history"></div>
                            </div>
                            <div class="col-xl-12 col-lg-8 col-md-12 col-6">
                                <div class="chess-console-captured"></div>
                            </div>
                        </div>
                    </div>
                </div>`;
    }
    Object.assign(this.props, props);
    this.messageBroker = new MessageBroker();
    const innerHTMLElement = DomUtils.createElement(this.context.innerHTML);
    if (!(innerHTMLElement instanceof Element) || !innerHTMLElement.querySelector(".chess-console") && !innerHTMLElement.classList.contains("chess-console")) {
      this.context.innerHTML = this.props.template;
    }
    this.componentContainers = {
      center: this.context.querySelector(".chess-console-center"),
      left: this.context.querySelector(".chess-console-left"),
      right: this.context.querySelector(".chess-console-right"),
      board: this.context.querySelector(".chess-console-board"),
      controlButtons: this.context.querySelector(".control-buttons"),
      notifications: this.context.querySelector(".chess-console-notifications")
    };
    this.components = {
      // put here components, which want to be accessible from other components
    };
    this.player = new player.type(this, player.name, player.props);
    this.opponent = new opponent.type(this, opponent.name, opponent.props);
    this.persistence = void 0;
  }
  initGame(props = {}, requestNextMove = true) {
    Object.assign(this.props, props);
    this.state.orientation = this.props.playerColor;
    if (props.pgn) {
      this.state.chess.loadPgn(props.pgn, { sloppy: true });
      this.state.plyViewed = this.state.chess.plyCount();
    } else {
      this.state.chess.load(FEN.start);
      this.state.plyViewed = 0;
    }
    if (requestNextMove) {
      this.nextMove();
    }
    this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.initGame, { props });
  }
  newGame(props = {}) {
    this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.newGame, { props });
    this.initGame(props);
    if (this.components.board.chessboard) {
      this.components.board.chessboard.disableMoveInput();
    }
  }
  playerWhite() {
    return this.props.playerColor === COLOR3.white ? this.player : this.opponent;
  }
  playerBlack() {
    return this.props.playerColor === COLOR3.white ? this.opponent : this.player;
  }
  playerToMove() {
    if (this.state.chess.gameOver()) {
      return null;
    } else {
      if (this.state.chess.turn() === "w") {
        return this.playerWhite();
      } else {
        return this.playerBlack();
      }
    }
  }
  /*
   * - calls `moveRequest()` in next player
   */
  nextMove() {
    const playerToMove = this.playerToMove();
    if (playerToMove) {
      this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.moveRequest, { playerToMove });
      setTimeout(() => {
        playerToMove.moveRequest(this.state.chess.fen(), (move) => {
          return this.handleMoveResponse(move);
        });
      });
    }
  }
  /*
   * - validates move
   * - requests nextMove
   */
  handleMoveResponse(move) {
    const playerMoved = this.playerToMove();
    const moveResult = this.state.chess.move(move);
    if (!moveResult) {
      if (this.props.debug) {
        console.warn("illegalMove", this.state.chess, move);
      }
      this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.illegalMove, {
        playerMoved,
        move
      });
      return moveResult;
    }
    if (this.state.plyViewed === this.state.chess.plyCount() - 1) {
      this.state.plyViewed++;
    }
    this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.legalMove, {
      playerMoved,
      move,
      moveResult
    });
    if (!this.state.chess.gameOver()) {
      this.nextMove();
    } else {
      let wonColor = null;
      if (this.state.chess.inCheckmate()) {
        wonColor = this.state.chess.turn() === COLOR3.white ? COLOR3.black : COLOR3.white;
      }
      this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.gameOver, { wonColor });
    }
    return moveResult;
  }
  undoMove() {
    this.components.board.chessboard.disableMoveInput();
    this.state.chess.undo();
    if (this.playerToMove() !== this.player) {
      this.state.chess.undo();
    }
    if (this.state.plyViewed > this.state.chess.plyCount()) {
      this.state.plyViewed = this.state.chess.plyCount();
    }
    this.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.moveUndone);
    this.nextMove();
  }
};

// node_modules/chess-console/src/ChessConsolePlayer.js
var ChessConsolePlayer = class {
  constructor(chessConsole, name) {
    this.chessConsole = chessConsole;
    this.name = name;
  }
  /**
   * Called, when the Console requests the next Move from a Player.
   * The Player should answer the moveRequest with a moveResponse.
   * The moveResponse then returns the move result, if no move result was returned, the move was not legal.
   * @param fen current position
   * @param moveResponse a callback function to call as the moveResponse. Parameter is an object,
   * containing 'from' and `to`. Example: `moveResult = moveResponse({from: "e2", to: "e4", promotion: null})`.
   */
  moveRequest(fen, moveResponse) {
  }
};

// node_modules/chess-console/src/players/LocalPlayer.js
var LocalPlayer = class extends ChessConsolePlayer {
  constructor(chessConsole, name, props) {
    super(chessConsole, name);
    this.props = {
      allowPremoves: false
    };
    Object.assign(this.props, props);
    this.premoves = [];
  }
  /**
   * The return value returns, if valid or if is promotion.
   * The callback returns the move.
   */
  validateMoveAndPromote(fen, squareFrom, squareTo, callback) {
    const tmpChess = new Chess(fen);
    let move = { from: squareFrom, to: squareTo };
    const moveResult = tmpChess.move(move);
    if (moveResult) {
      callback(moveResult);
      return true;
    } else {
      if (tmpChess.get(squareFrom) && tmpChess.get(squareFrom).type === "p") {
        const possibleMoves = tmpChess.moves({ square: squareFrom, verbose: true });
        for (let possibleMove of possibleMoves) {
          if (possibleMove.to === squareTo && possibleMove.promotion) {
            const chessboard = this.chessConsole.components.board.chessboard;
            chessboard.showPromotionDialog(squareTo, tmpChess.turn(), (event) => {
              console.log(event);
              if (event.piece) {
                move.promotion = event.piece.charAt(1);
                console.log(move);
                callback(tmpChess.move(move));
              } else {
                callback(null);
              }
            });
            return true;
          }
        }
      }
    }
    callback(null);
    return false;
  }
  /**
   * Handles the events from cm-chessboard
   *
   * INPUT_EVENT_TYPE.moveDone
   * - validates Move, returns false, if not valid
   * - does promotion
   * - calls moveResponse()
   *
   * INPUT_EVENT_TYPE.moveStart
   * - allowed only the right color to move
   */
  chessboardMoveInputCallback(event, moveResponse) {
    const gameFen = this.chessConsole.state.chess.fen();
    if (this.chessConsole.playerToMove() === this) {
      if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
        return this.validateMoveAndPromote(gameFen, event.squareFrom, event.squareTo, (moveResult) => {
          let result;
          if (moveResult) {
            result = moveResponse(moveResult);
          } else {
            result = moveResponse({ from: event.squareFrom, to: event.squareTo });
            this.premoves = [];
            this.updatePremoveMarkers();
          }
          if (result) {
            if (!this.props.allowPremoves) {
              this.chessConsole.components.board.chessboard.disableMoveInput();
            }
          }
        });
      } else if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
        if (this.chessConsole.state.plyViewed !== this.chessConsole.state.chess.plyCount()) {
          this.chessConsole.state.plyViewed = this.chessConsole.state.chess.plyCount();
          return false;
        } else {
          const possibleMoves = this.chessConsole.state.chess.moves({ square: event.square });
          if (possibleMoves.length > 0) {
            return true;
          } else {
            this.chessConsole.components.board.chessConsole.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.illegalMove, {
              move: {
                from: event.squareFrom
              }
            });
            return false;
          }
        }
      }
    } else {
      if (event.type === INPUT_EVENT_TYPE.validateMoveInput) {
        this.premoves.push(event);
        this.updatePremoveMarkers();
      }
      return true;
    }
  }
  moveRequest(fen, moveResponse) {
    if (!this.contextMenuEvent) {
      this.chessConsole.components.board.chessboard.context.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        if (this.premoves.length > 0) {
          this.resetBoardPosition();
          this.premoves = [];
          this.updatePremoveMarkers();
        }
      });
      this.contextMenuEvent = true;
    }
    const color = this.chessConsole.state.chess.turn() === "w" ? COLOR3.white : COLOR3.black;
    if (!this.chessConsole.state.chess.gameOver()) {
      if (this.premoves.length > 0) {
        const eventFromPremovesQueue = this.premoves.shift();
        this.updatePremoveMarkers();
        setTimeout(() => {
          this.chessboardMoveInputCallback(eventFromPremovesQueue, moveResponse);
        }, 100);
        return true;
      }
      this.chessConsole.components.board.chessboard.enableMoveInput(
        (event) => {
          return this.chessboardMoveInputCallback(event, moveResponse);
        },
        color
      );
    }
  }
  updatePremoveMarkers() {
    this.chessConsole.components.board.chessboard.removeMarkers(this.chessConsole.components.board.props.markers.premove);
    for (const premove of this.premoves) {
      this.chessConsole.components.board.chessboard.addMarker(this.chessConsole.components.board.props.markers.premove, premove.squareTo);
    }
  }
  resetBoardPosition() {
    this.chessConsole.components.board.chessboard.setPosition(this.chessConsole.state.chess.fen(), true);
  }
};

// node_modules/cm-chessboard/src/extensions/markers/Markers.js
var MARKER_TYPE = {
  frame: { class: "marker-frame", slice: "markerFrame" },
  framePrimary: { class: "marker-frame-primary", slice: "markerFrame" },
  frameDanger: { class: "marker-frame-danger", slice: "markerFrame" },
  circle: { class: "marker-circle", slice: "markerCircle" },
  circlePrimary: { class: "marker-circle-primary", slice: "markerCircle" },
  circleDanger: { class: "marker-circle-danger", slice: "markerCircle" },
  square: { class: "marker-square", slice: "markerSquare" },
  dot: { class: "marker-dot", slice: "markerDot", position: "above" },
  bevel: { class: "marker-bevel", slice: "markerBevel" }
};
var Markers = class extends Extension {
  /** @constructor */
  constructor(chessboard, props = {}) {
    super(chessboard);
    this.registerExtensionPoint(EXTENSION_POINT.afterRedrawBoard, () => {
      this.onRedrawBoard();
    });
    this.props = {
      autoMarkers: MARKER_TYPE.frame,
      // set to `null` to disable autoMarkers
      sprite: "extensions/markers/markers.svg"
      // the sprite file of the markers
    };
    Object.assign(this.props, props);
    if (chessboard.props.assetsCache) {
      chessboard.view.cacheSpriteToDiv("cm-chessboard-markers", this.getSpriteUrl());
    }
    chessboard.addMarker = this.addMarker.bind(this);
    chessboard.getMarkers = this.getMarkers.bind(this);
    chessboard.removeMarkers = this.removeMarkers.bind(this);
    this.markerGroupDown = Svg.addElement(chessboard.view.markersLayer, "g", { class: "markers" });
    this.markerGroupUp = Svg.addElement(chessboard.view.markersTopLayer, "g", { class: "markers" });
    this.markers = [];
    if (this.props.autoMarkers) {
      Object.assign(this.props.autoMarkers, this.props.autoMarkers);
      this.registerExtensionPoint(EXTENSION_POINT.moveInput, (event) => {
        this.drawAutoMarkers(event);
      });
    }
  }
  drawAutoMarkers(event) {
    if (event.type !== INPUT_EVENT_TYPE.moveInputFinished) {
      this.removeMarkers(this.props.autoMarkers);
    }
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted && !event.moveInputCallbackResult) {
      return;
    }
    if (event.type === INPUT_EVENT_TYPE.moveInputStarted || event.type === INPUT_EVENT_TYPE.movingOverSquare) {
      if (event.squareFrom) {
        this.addMarker(this.props.autoMarkers, event.squareFrom);
      }
      if (event.squareTo) {
        this.addMarker(this.props.autoMarkers, event.squareTo);
      }
    }
  }
  onRedrawBoard() {
    while (this.markerGroupUp.firstChild) {
      this.markerGroupUp.removeChild(this.markerGroupUp.firstChild);
    }
    while (this.markerGroupDown.firstChild) {
      this.markerGroupDown.removeChild(this.markerGroupDown.firstChild);
    }
    this.markers.forEach(
      (marker) => {
        this.drawMarker(marker);
      }
    );
  }
  drawMarker(marker) {
    let markerGroup;
    if (marker.type.position === "above") {
      markerGroup = Svg.addElement(this.markerGroupUp, "g");
    } else {
      markerGroup = Svg.addElement(this.markerGroupDown, "g");
    }
    markerGroup.setAttribute("data-square", marker.square);
    const point = this.chessboard.view.squareToPoint(marker.square);
    const transform = this.chessboard.view.svg.createSVGTransform();
    transform.setTranslate(point.x, point.y);
    markerGroup.transform.baseVal.appendItem(transform);
    const spriteUrl = this.chessboard.props.assetsCache ? "" : this.getSpriteUrl();
    const markerUse = Svg.addElement(
      markerGroup,
      "use",
      { href: `${spriteUrl}#${marker.type.slice}`, class: "marker " + marker.type.class }
    );
    const transformScale = this.chessboard.view.svg.createSVGTransform();
    transformScale.setScale(this.chessboard.view.scalingX, this.chessboard.view.scalingY);
    markerUse.transform.baseVal.appendItem(transformScale);
    return markerGroup;
  }
  addMarker(type, square) {
    if (typeof type === "string" || typeof square === "object") {
      console.error("changed the signature of `addMarker` to `(type, square)` with v5.1.x");
      return;
    }
    this.markers.push(new Marker(square, type));
    this.onRedrawBoard();
  }
  getMarkers(type = void 0, square = void 0) {
    if (typeof type === "string" || typeof square === "object") {
      console.error("changed the signature of `getMarkers` to `(type, square)` with v5.1.x");
      return;
    }
    let markersFound = [];
    this.markers.forEach((marker) => {
      if (marker.matches(square, type)) {
        markersFound.push(marker);
      }
    });
    return markersFound;
  }
  removeMarkers(type = void 0, square = void 0) {
    if (typeof type === "string" || typeof square === "object") {
      console.error("changed the signature of `removeMarkers` to `(type, square)` with v5.1.x");
      return;
    }
    this.markers = this.markers.filter((marker) => !marker.matches(square, type));
    this.onRedrawBoard();
  }
  getSpriteUrl() {
    if (Utils.isAbsoluteUrl(this.props.sprite)) {
      return this.props.sprite;
    } else {
      return this.chessboard.props.assetsUrl + this.props.sprite;
    }
  }
};
var Marker = class {
  constructor(square, type) {
    this.square = square;
    this.type = type;
  }
  matches(square = void 0, type = void 0) {
    if (!type && !square) {
      return true;
    } else if (!type) {
      if (square === this.square) {
        return true;
      }
    } else if (!square) {
      if (this.type === type) {
        return true;
      }
    } else if (this.type === type && square === this.square) {
      return true;
    }
    return false;
  }
};

// node_modules/cm-web-modules/src/utils/CoreUtils.js
var CoreUtils = class _CoreUtils {
  static debounce(callback, wait = 0, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      if (immediate && !timeout) {
        callback(...args);
        timeout = true;
      } else {
        const debounced = () => {
          clearTimeout(timeout);
          callback(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(debounced, wait);
      }
    };
  }
  static mergeObjects(target, source) {
    const isObject = (obj) => obj && typeof obj === "object";
    if (!isObject(target) || !isObject(source)) {
      return source;
    }
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object) {
        Object.assign(source[key], _CoreUtils.mergeObjects(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  }
  static createTask() {
    let resolve, reject;
    const promise = new Promise(function(_resolve, _reject) {
      resolve = _resolve;
      reject = _reject;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
  }
};

// node_modules/cm-chessboard/src/extensions/promotion-dialog/PromotionDialog.js
var DISPLAY_STATE = {
  hidden: "hidden",
  displayRequested: "displayRequested",
  shown: "shown"
};
var PROMOTION_DIALOG_RESULT_TYPE = {
  pieceSelected: "pieceSelected",
  canceled: "canceled"
};
var PromotionDialog = class extends Extension {
  /** @constructor */
  constructor(chessboard) {
    super(chessboard);
    this.registerExtensionPoint(EXTENSION_POINT.afterRedrawBoard, this.extensionPointRedrawBoard.bind(this));
    chessboard.showPromotionDialog = this.showPromotionDialog.bind(this);
    chessboard.isPromotionDialogShown = this.isPromotionDialogShown.bind(this);
    this.promotionDialogGroup = Svg.addElement(chessboard.view.interactiveTopLayer, "g", { class: "promotion-dialog-group" });
    this.state = {
      displayState: DISPLAY_STATE.hidden,
      callback: null,
      dialogParams: {
        square: null,
        color: null
      }
    };
  }
  // public (chessboard.showPromotionDialog)
  showPromotionDialog(square, color, callback) {
    this.state.dialogParams.square = square;
    this.state.dialogParams.color = color;
    this.state.callback = callback;
    this.setDisplayState(DISPLAY_STATE.displayRequested);
    setTimeout(
      () => {
        this.chessboard.view.positionsAnimationTask.then(() => {
          this.setDisplayState(DISPLAY_STATE.shown);
        });
      }
    );
  }
  // public (chessboard.isPromotionDialogShown)
  isPromotionDialogShown() {
    return this.state.displayState === DISPLAY_STATE.shown || this.state.displayState === DISPLAY_STATE.displayRequested;
  }
  // private
  extensionPointRedrawBoard() {
    this.redrawDialog();
  }
  drawPieceButton(piece, point) {
    const squareWidth = this.chessboard.view.squareWidth;
    const squareHeight = this.chessboard.view.squareHeight;
    Svg.addElement(
      this.promotionDialogGroup,
      "rect",
      {
        x: point.x,
        y: point.y,
        width: squareWidth,
        height: squareHeight,
        class: "promotion-dialog-button",
        "data-piece": piece
      }
    );
    this.chessboard.view.drawPiece(this.promotionDialogGroup, piece, point);
  }
  redrawDialog() {
    while (this.promotionDialogGroup.firstChild) {
      this.promotionDialogGroup.removeChild(this.promotionDialogGroup.firstChild);
    }
    if (this.state.displayState === DISPLAY_STATE.shown) {
      const squareWidth = this.chessboard.view.squareWidth;
      const squareHeight = this.chessboard.view.squareHeight;
      const squareCenterPoint = this.chessboard.view.squareToPoint(this.state.dialogParams.square);
      squareCenterPoint.x = squareCenterPoint.x + squareWidth / 2;
      squareCenterPoint.y = squareCenterPoint.y + squareHeight / 2;
      let turned = false;
      const rank2 = parseInt(this.state.dialogParams.square.charAt(1), 10);
      if (this.chessboard.getOrientation() === COLOR3.white && rank2 < 5 || this.chessboard.getOrientation() === COLOR3.black && rank2 >= 5) {
        turned = true;
      }
      const offsetY = turned ? -4 * squareHeight : 0;
      const offsetX = squareCenterPoint.x + squareWidth > this.chessboard.view.width ? -squareWidth : 0;
      Svg.addElement(
        this.promotionDialogGroup,
        "rect",
        {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y + offsetY,
          width: squareWidth,
          height: squareHeight * 4,
          class: "promotion-dialog"
        }
      );
      const dialogParams = this.state.dialogParams;
      if (turned) {
        this.drawPieceButton(PIECE[dialogParams.color + "q"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y - squareHeight
        });
        this.drawPieceButton(PIECE[dialogParams.color + "r"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y - squareHeight * 2
        });
        this.drawPieceButton(PIECE[dialogParams.color + "b"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y - squareHeight * 3
        });
        this.drawPieceButton(PIECE[dialogParams.color + "n"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y - squareHeight * 4
        });
      } else {
        this.drawPieceButton(PIECE[dialogParams.color + "q"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y
        });
        this.drawPieceButton(PIECE[dialogParams.color + "r"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y + squareHeight
        });
        this.drawPieceButton(PIECE[dialogParams.color + "b"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y + squareHeight * 2
        });
        this.drawPieceButton(PIECE[dialogParams.color + "n"], {
          x: squareCenterPoint.x + offsetX,
          y: squareCenterPoint.y + squareHeight * 3
        });
      }
    }
  }
  promotionDialogOnClickPiece(event) {
    if (event.button !== 2) {
      if (event.target.dataset.piece) {
        if (this.state.callback) {
          this.state.callback({
            type: PROMOTION_DIALOG_RESULT_TYPE.pieceSelected,
            square: this.state.dialogParams.square,
            piece: event.target.dataset.piece
          });
        }
        this.setDisplayState(DISPLAY_STATE.hidden);
      } else {
        this.promotionDialogOnCancel(event);
      }
    }
  }
  promotionDialogOnCancel(event) {
    if (this.state.displayState === DISPLAY_STATE.shown) {
      event.preventDefault();
      this.setDisplayState(DISPLAY_STATE.hidden);
      if (this.state.callback) {
        this.state.callback({ type: PROMOTION_DIALOG_RESULT_TYPE.canceled });
      }
    }
  }
  contextMenu(event) {
    event.preventDefault();
    this.setDisplayState(DISPLAY_STATE.hidden);
    if (this.state.callback) {
      this.state.callback({ type: PROMOTION_DIALOG_RESULT_TYPE.canceled });
    }
  }
  setDisplayState(displayState) {
    this.state.displayState = displayState;
    if (displayState === DISPLAY_STATE.shown) {
      this.clickDelegate = Utils.delegate(
        this.chessboard.view.svg,
        "mousedown",
        "*",
        this.promotionDialogOnClickPiece.bind(this)
      );
      this.contextMenuListener = this.contextMenu.bind(this);
      this.chessboard.view.svg.addEventListener("contextmenu", this.contextMenuListener);
    } else if (displayState === DISPLAY_STATE.hidden) {
      this.clickDelegate.remove();
      this.chessboard.view.svg.removeEventListener("contextmenu", this.contextMenuListener);
    }
    this.redrawDialog();
  }
};

// node_modules/cm-chessboard/src/extensions/accessibility/Accessibility.js
var translations = {
  de: {
    chessboard: "Schachbrett",
    pieces_lists: "Figurenlisten",
    board_as_table: "Schachbrett als Tabelle",
    move_piece: "Figur bewegen",
    from: "Zug von",
    to: "Zug nach",
    move: "Zug ausf\xFChren",
    input_white_enabled: "Eingabe Wei\xDF aktiviert",
    input_black_enabled: "Eingabe Schwarz aktiviert",
    input_disabled: "Eingabe deaktiviert",
    pieces: "Figuren"
  },
  en: {
    chessboard: "Chessboard",
    pieces_lists: "Pieces lists",
    board_as_table: "Chessboard as table",
    move_piece: "Move piece",
    from: "Move from",
    to: "Move to",
    move: "Make move",
    input_white_enabled: "Input white enabled",
    input_black_enabled: "Input black enabled",
    input_disabled: "Input disabled",
    pieces: "Pieces"
  }
};
var Accessibility = class extends Extension {
  constructor(chessboard, props) {
    super(chessboard);
    this.props = {
      language: navigator.language.substring(0, 2).toLowerCase(),
      // supports "de" and "en" for now, used for pieces naming
      brailleNotationInAlt: true,
      // show the braille notation of the position in the alt attribute of the SVG image
      movePieceForm: true,
      // display a form to move a piece (from, to, move)
      boardAsTable: true,
      // display the board additionally as HTML table
      piecesAsList: true,
      // display the pieces additionally as List
      visuallyHidden: true
      // hide all those extra outputs visually but keep them accessible for screen readers and braille displays
    };
    Object.assign(this.props, props);
    if (this.props.language !== "de" && this.props.language !== "en") {
      this.props.language = "en";
    }
    this.lang = this.props.language;
    this.tPieces = piecesTranslations[this.lang];
    this.t = translations[this.lang];
    this.components = [];
    if (this.props.movePieceForm || this.props.boardAsTable || this.props.piecesAsList) {
      const container = document.createElement("div");
      container.classList.add("cm-chessboard-accessibility");
      this.chessboard.context.appendChild(container);
      if (this.props.visuallyHidden) {
        container.classList.add("visually-hidden");
      }
      if (this.props.movePieceForm) {
        this.components.push(new MovePieceForm(container, this));
      }
      if (this.props.boardAsTable) {
        this.components.push(new BoardAsTable(container, this));
      }
      if (this.props.piecesAsList) {
        this.components.push(new PiecesAsList(container, this));
      }
    }
    if (this.props.brailleNotationInAlt) {
      this.components.push(new BrailleNotationInAlt(this));
    }
  }
};
var BrailleNotationInAlt = class {
  constructor(extension) {
    this.extension = extension;
    extension.registerExtensionPoint(EXTENSION_POINT.positionChanged, () => {
      this.redraw();
    });
  }
  redraw() {
    const pieces = this.extension.chessboard.state.position.getPieces();
    let listW = piecesTranslations[this.extension.lang].colors.w.toUpperCase() + ":";
    let listB = piecesTranslations[this.extension.lang].colors.b.toUpperCase() + ":";
    for (const piece of pieces) {
      const pieceName = piece.name === "p" ? "" : piecesTranslations[this.extension.lang].pieces[piece.name].toUpperCase();
      if (piece.color === "w") {
        listW += " " + pieceName + piece.position;
      } else {
        listB += " " + pieceName + piece.position;
      }
    }
    const altText = `${listW}
${listB}`;
    this.extension.chessboard.view.svg.setAttribute("alt", altText);
  }
};
var MovePieceForm = class {
  constructor(container, extension) {
    this.chessboard = extension.chessboard;
    this.movePieceFormContainer = Utils.createDomElement(`
<div>
    <h3 id="hl_form_${this.chessboard.id}">${extension.t.move_piece}</h3>
    <form aria-labelledby="hl_form_${this.chessboard.id}">
        <label for="move_piece_input_from_${this.chessboard.id}">${extension.t.from}</label>
        <input class="input-from" type="text" size="2" id="move_piece_input_from_${this.chessboard.id}"/>
        <label for="move_piece_input_to_${this.chessboard.id}">${extension.t.to}</label>
        <input class="input-to" type="text" size="2" id="move_piece_input_to_${this.chessboard.id}"/>
        <button type="submit" class="button-move">${extension.t.move}</button>
    </form>
</div>`);
    this.form = this.movePieceFormContainer.querySelector("form");
    this.inputFrom = this.form.querySelector(".input-from");
    this.inputTo = this.form.querySelector(".input-to");
    this.moveButton = this.form.querySelector(".button-move");
    this.form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      if (this.chessboard.state.moveInputCallback({
        chessboard: this.chessboard,
        type: INPUT_EVENT_TYPE.validateMoveInput,
        squareFrom: this.inputFrom.value,
        squareTo: this.inputTo.value
      })) {
        this.chessboard.movePiece(
          this.inputFrom.value,
          this.inputTo.value,
          true
        ).then(() => {
          this.inputFrom.value = "";
          this.inputTo.value = "";
        });
      }
    });
    container.appendChild(this.movePieceFormContainer);
    extension.registerExtensionPoint(EXTENSION_POINT.moveInputToggled, () => {
      this.redraw();
    });
  }
  redraw() {
    if (this.inputFrom) {
      if (this.chessboard.state.inputWhiteEnabled || this.chessboard.state.inputBlackEnabled) {
        this.inputFrom.disabled = false;
        this.inputTo.disabled = false;
        this.moveButton.disabled = false;
      } else {
        this.inputFrom.disabled = true;
        this.inputTo.disabled = true;
        this.moveButton.disabled = true;
      }
    }
  }
};
var BoardAsTable = class {
  constructor(container, extension) {
    this.extension = extension;
    this.chessboard = extension.chessboard;
    this.boardAsTableContainer = Utils.createDomElement(`<div><h3 id="hl_table_${this.chessboard.id}">${extension.t.board_as_table}</h3><div class="table"></div></div>`);
    this.boardAsTable = this.boardAsTableContainer.querySelector(".table");
    container.appendChild(this.boardAsTableContainer);
    extension.registerExtensionPoint(EXTENSION_POINT.positionChanged, () => {
      this.redraw();
    });
    extension.registerExtensionPoint(EXTENSION_POINT.boardChanged, () => {
      this.redraw();
    });
  }
  redraw() {
    const squares = this.chessboard.state.position.squares.slice();
    const ranks = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const files = ["8", "7", "6", "5", "4", "3", "2", "1"];
    if (this.chessboard.state.orientation === COLOR3.black) {
      ranks.reverse();
      files.reverse();
      squares.reverse();
    }
    let html = `<table aria-labelledby="hl_table_${this.chessboard.id}"><tr><th></th>`;
    for (const rank2 of ranks) {
      html += `<th scope='col'>${rank2}</th>`;
    }
    html += "</tr>";
    for (let x = 7; x >= 0; x--) {
      html += `<tr><th scope="row">${files[7 - x]}</th>`;
      for (let y = 0; y < 8; y++) {
        const pieceCode = squares[y % 8 + x * 8];
        let color, name;
        if (pieceCode) {
          color = pieceCode.charAt(0);
          name = pieceCode.charAt(1);
          html += `<td>${renderPieceTitle(this.extension.lang, name, color)}</td>`;
        } else {
          html += `<td></td>`;
        }
      }
      html += "</tr>";
    }
    html += "</table>";
    this.boardAsTable.innerHTML = html;
  }
};
var PiecesAsList = class {
  constructor(container, extension) {
    this.extension = extension;
    this.chessboard = extension.chessboard;
    this.piecesListContainer = Utils.createDomElement(`<div><h3 id="hl_lists_${this.chessboard.id}">${extension.t.pieces_lists}</h3><div class="list"></div></div>`);
    this.piecesList = this.piecesListContainer.querySelector(".list");
    container.appendChild(this.piecesListContainer);
    extension.registerExtensionPoint(EXTENSION_POINT.positionChanged, () => {
      this.redraw();
    });
  }
  redraw() {
    const pieces = this.chessboard.state.position.getPieces();
    let listW = "";
    let listB = "";
    for (const piece of pieces) {
      if (piece.color === "w") {
        listW += `<li class="list-inline-item">${renderPieceTitle(this.extension.lang, piece.name)} ${piece.position}</li>`;
      } else {
        listB += `<li class="list-inline-item">${renderPieceTitle(this.extension.lang, piece.name)} ${piece.position}</li>`;
      }
    }
    this.piecesList.innerHTML = `
        <h4 id="white_${this.chessboard.id}">${this.extension.t.pieces} ${this.extension.tPieces.colors_long.w}</h4>
        <ul aria-labelledby="white_${this.chessboard.id}" class="list-inline">${listW}</ul>
        <h4 id="black_${this.chessboard.id}">${this.extension.t.pieces} ${this.extension.tPieces.colors_long.b}</h4>
        <ul aria-labelledby="black_${this.chessboard.id}" class="list-inline">${listB}</ul>`;
  }
};

// node_modules/cm-chessboard/src/extensions/auto-border-none/AutoBorderNone.js
var AutoBorderNone = class extends Extension {
  constructor(chessboard, props = {}) {
    super(chessboard);
    this.props = {
      chessboardBorderType: chessboard.props.style.borderType,
      borderNoneBelow: 540
      // pixels width of the board, where the border is set to none
    };
    Object.assign(this.props, props);
    this.registerExtensionPoint(EXTENSION_POINT.beforeRedrawBoard, this.extensionPointBeforeRedrawBoard.bind(this));
  }
  extensionPointBeforeRedrawBoard() {
    let newBorderType;
    if (this.chessboard.view.width < this.props.borderNoneBelow) {
      newBorderType = "none";
    } else {
      newBorderType = this.props.chessboardBorderType;
    }
    if (newBorderType !== this.chessboard.props.style.borderType) {
      this.chessboard.props.style.borderType = newBorderType;
      this.chessboard.view.updateMetrics();
    }
  }
};

// node_modules/chess-console/src/components/Board.js
var CONSOLE_MARKER_TYPE = {
  moveInput: { class: "marker-frame", slice: "markerFrame" },
  check: { class: "marker-circle-danger", slice: "markerCircle" },
  wrongMove: { class: "marker-frame-danger", slice: "markerFrame" },
  premove: { class: "marker-frame-primary", slice: "markerFrame" },
  legalMove: { class: "marker-dot", slice: "markerDot" },
  legalMoveCapture: { class: "marker-bevel", slice: "markerBevel" }
};
var Board = class extends UiComponent {
  constructor(chessConsole, props = {}) {
    super(chessConsole.componentContainers.board, props);
    chessConsole.components.board = this;
    this.initialized = new Promise((resolve) => {
      this.i18n = chessConsole.i18n;
      this.i18n.load({
        de: {
          chessBoard: "Schachbrett"
        },
        en: {
          chessBoard: "Chess Board"
        }
      }).then(() => {
        this.chessConsole = chessConsole;
        this.elements = {
          playerTop: document.createElement("div"),
          playerBottom: document.createElement("div"),
          chessboard: document.createElement("div")
        };
        this.elements.playerTop.setAttribute("class", "player top");
        this.elements.playerTop.innerHTML = "&nbsp;";
        this.elements.playerBottom.setAttribute("class", "player bottom");
        this.elements.playerBottom.innerHTML = "&nbsp;";
        this.elements.chessboard.setAttribute("class", "chessboard");
        this.context.appendChild(DomUtils.createElement("<h2 class='visually-hidden'>" + this.i18n.t("chessBoard") + "</h2>"));
        this.context.appendChild(this.elements.playerTop);
        this.context.appendChild(this.elements.chessboard);
        this.context.appendChild(this.elements.playerBottom);
        this.chessConsole.state.observeChess((params) => {
          let animated = true;
          if (params.functionName === "load_pgn") {
            animated = false;
          }
          this.setPositionOfPlyViewed(animated);
          this.markLastMove();
        });
        Observe.property(this.chessConsole.state, "plyViewed", (props2) => {
          this.setPositionOfPlyViewed(props2.oldValue !== void 0);
          this.markLastMove();
        });
        this.props = {
          position: FEN2.empty,
          orientation: chessConsole.state.orientation,
          assetsUrl: void 0,
          markLegalMoves: true,
          style: {
            aspectRatio: 0.98
          },
          accessibility: {
            active: true,
            // turn accessibility on or off
            brailleNotationInAlt: true,
            // show the braille notation of the position in the alt attribute of the SVG image
            movePieceForm: true,
            // display a form to move a piece (from, to, move)
            boardAsTable: true,
            // display the board additionally as HTML table
            piecesAsList: true,
            // display the pieces additionally as List
            visuallyHidden: true
            // hide all those extra outputs visually but keep them accessible for screen readers and braille displays
          },
          markers: {
            moveInput: CONSOLE_MARKER_TYPE.moveInput,
            check: CONSOLE_MARKER_TYPE.check,
            wrongMove: CONSOLE_MARKER_TYPE.wrongMove,
            premove: CONSOLE_MARKER_TYPE.premove,
            legalMove: CONSOLE_MARKER_TYPE.legalMove,
            legalMoveCapture: CONSOLE_MARKER_TYPE.legalMoveCapture
          },
          extensions: [{ class: PromotionDialog }, {
            class: ChessConsoleMarkers,
            props: {
              board: this
            }
          }, { class: AutoBorderNone }]
        };
        CoreUtils.mergeObjects(this.props, props);
        if (this.props.accessibility.active) {
          this.props.extensions.push({
            class: Accessibility,
            props: this.props.accessibility
          });
        }
        this.chessboard = new Chessboard(this.elements.chessboard, this.props);
        Observe.property(chessConsole.state, "orientation", () => {
          this.setPlayerNames();
          this.chessboard.setOrientation(chessConsole.state.orientation).then(() => {
            this.markPlayerToMove();
          });
        });
        Observe.property(chessConsole.player, "name", () => {
          this.setPlayerNames();
        });
        Observe.property(chessConsole.opponent, "name", () => {
          this.setPlayerNames();
        });
        chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.moveRequest, () => {
          this.markPlayerToMove();
        });
        this.chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.illegalMove, (message) => {
          this.chessboard.removeMarkers(this.props.markers.wrongMove);
          clearTimeout(this.removeMarkersTimeout);
          if (message.move.from) {
            this.chessboard.addMarker(this.props.markers.wrongMove, message.move.from);
          } else {
            console.warn("illegalMove without `message.move.from`");
          }
          if (message.move.to) {
            this.chessboard.addMarker(this.props.markers.wrongMove, message.move.to);
          }
          this.removeMarkersTimeout = setTimeout(() => {
            this.chessboard.removeMarkers(this.props.markers.wrongMove);
          }, 500);
        });
        this.setPositionOfPlyViewed(false);
        this.setPlayerNames();
        this.markPlayerToMove();
        this.markLastMove();
        resolve(this);
      });
    });
    this.initialization = this.initialized;
  }
  setPositionOfPlyViewed(animated = true) {
    clearTimeout(this.setPositionOfPlyViewedDebounced);
    this.setPositionOfPlyViewedDebounced = setTimeout(() => {
      const to = this.chessConsole.state.chess.fenOfPly(this.chessConsole.state.plyViewed);
      this.chessboard.setPosition(to, animated);
    });
  }
  markLastMove() {
    window.clearTimeout(this.markLastMoveDebounce);
    this.markLastMoveDebounce = setTimeout(() => {
      this.chessboard.removeMarkers(this.props.markers.moveInput);
      this.chessboard.removeMarkers(this.props.markers.check);
      if (this.chessConsole.state.plyViewed === this.chessConsole.state.chess.plyCount()) {
        const lastMove = this.chessConsole.state.chess.lastMove();
        if (lastMove) {
          this.chessboard.addMarker(this.props.markers.moveInput, lastMove.from);
          this.chessboard.addMarker(this.props.markers.moveInput, lastMove.to);
        }
        if (this.chessConsole.state.chess.inCheck() || this.chessConsole.state.chess.inCheckmate()) {
          const kingSquare = this.chessConsole.state.chess.pieces("k", this.chessConsole.state.chess.turn())[0];
          this.chessboard.addMarker(this.props.markers.check, kingSquare.square);
        }
      }
    });
  }
  setPlayerNames() {
    window.clearTimeout(this.setPlayerNamesDebounce);
    this.setPlayerNamesDebounce = setTimeout(() => {
      if (this.chessConsole.props.playerColor === this.chessConsole.state.orientation) {
        this.elements.playerBottom.innerHTML = this.chessConsole.player.name;
        this.elements.playerTop.innerHTML = this.chessConsole.opponent.name;
      } else {
        this.elements.playerBottom.innerHTML = this.chessConsole.opponent.name;
        this.elements.playerTop.innerHTML = this.chessConsole.player.name;
      }
    });
  }
  markPlayerToMove() {
    clearTimeout(this.markPlayerToMoveDebounce);
    this.markPlayerToMoveDebounce = setTimeout(() => {
      this.elements.playerTop.classList.remove("to-move");
      this.elements.playerBottom.classList.remove("to-move");
      this.elements.playerTop.classList.remove("not-to-move");
      this.elements.playerBottom.classList.remove("not-to-move");
      const playerMove = this.chessConsole.playerToMove();
      if (this.chessConsole.state.orientation === COLOR3.white && playerMove === this.chessConsole.playerWhite() || this.chessConsole.state.orientation === COLOR3.black && playerMove === this.chessConsole.playerBlack()) {
        this.elements.playerBottom.classList.add("to-move");
        this.elements.playerTop.classList.add("not-to-move");
      } else {
        this.elements.playerTop.classList.add("to-move");
        this.elements.playerBottom.classList.add("not-to-move");
      }
    }, 10);
  }
};
var ChessConsoleMarkers = class extends Markers {
  drawAutoMarkers(event) {
    clearTimeout(this.drawAutoMarkersDebounced);
    this.drawAutoMarkersDebounced = setTimeout(
      () => {
        this.removeMarkers(this.props.autoMarkers);
        const board = this.props.board;
        const moves = this.props.board.chessConsole.state.chess.moves({ square: event.square, verbose: true });
        if (board.props.markLegalMoves) {
          if (event.type === INPUT_EVENT_TYPE.moveInputStarted || event.type === INPUT_EVENT_TYPE.validateMoveInput || event.type === INPUT_EVENT_TYPE.moveInputCanceled || event.type === INPUT_EVENT_TYPE.moveInputFinished) {
            event.chessboard.removeMarkers(board.props.markers.legalMove);
            event.chessboard.removeMarkers(board.props.markers.legalMoveCapture);
          }
          if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
            for (const move of moves) {
              if (move.promotion && move.promotion !== "q") {
                continue;
              }
              if (event.chessboard.getPiece(move.to)) {
                event.chessboard.addMarker(board.props.markers.legalMoveCapture, move.to);
              } else {
                event.chessboard.addMarker(board.props.markers.legalMove, move.to);
              }
            }
          }
        }
        if (event.type === INPUT_EVENT_TYPE.moveInputStarted) {
          if (event.moveInputCallbackResult) {
            this.addMarker(this.props.autoMarkers, event.squareFrom);
          }
        } else if (event.type === INPUT_EVENT_TYPE.movingOverSquare) {
          this.addMarker(this.props.autoMarkers, event.squareFrom);
          if (event.squareTo) {
            this.addMarker(this.props.autoMarkers, event.squareTo);
          }
        }
      }
    );
  }
};

// node_modules/chess-console/src/components/GameStateOutput.js
var GameStateOutput = class extends UiComponent {
  constructor(chessConsole) {
    super(chessConsole.componentContainers.notifications);
    this.chessConsole = chessConsole;
    this.i18n = chessConsole.i18n;
    this.i18n.load(
      {
        de: {
          game_over: "Das Spiel ist beendet",
          check: "Schach!",
          checkmate: "Schachmatt",
          draw: "Remis",
          stalemate: "Patt",
          threefold_repetition: "Remis durch dreifache Wiederholung"
        },
        en: {
          game_over: "The game is over",
          check: "Check!",
          checkmate: "Checkmate",
          draw: "Remis",
          stalemate: "Stalemate",
          threefold_repetition: "Remis by threefold repetition"
        }
      }
    );
    this.element = document.createElement("div");
    this.element.setAttribute("class", "gameState alert alert-primary mb-2");
    this.context.appendChild(this.element);
    this.chessConsole.state.observeChess(() => {
      this.redraw();
    });
    this.redraw();
  }
  redraw() {
    const chess = this.chessConsole.state.chess;
    let html = "";
    if (chess.gameOver()) {
      html += `<b>${this.i18n.t("game_over")}</b><br/>`;
      if (chess.inCheckmate()) {
        html += `${this.i18n.t("checkmate")}`;
      } else if (chess.inStalemate()) {
        html += `${this.i18n.t("stalemate")}`;
      } else if (chess.inThreefoldRepetition()) {
        html += `${this.i18n.t("threefold_repetition")}`;
      } else if (chess.inDraw()) {
        html += `${this.i18n.t("draw")}`;
      }
    } else if (chess.inCheck()) {
      html = `${this.i18n.t("check")}`;
    } else {
      html = "";
    }
    if (html) {
      this.chessConsole.componentContainers.notifications.style.display = "block";
      this.element.innerHTML = `${html}`;
    } else {
      this.chessConsole.componentContainers.notifications.style.display = "none";
    }
  }
};

// node_modules/chess-console/src/tools/ChessRender.js
var PIECES2 = {
  notation: {
    de: {
      R: "T",
      N: "S",
      B: "L",
      Q: "D",
      K: "K",
      P: ""
    }
  },
  figures: {
    utf8: {
      Rw: "\u2656",
      Nw: "\u2658",
      Bw: "\u2657",
      Qw: "\u2655",
      Kw: "\u2654",
      Pw: "\u2659",
      Rb: "\u265C",
      Nb: "\u265E",
      Bb: "\u265D",
      Qb: "\u265B",
      Kb: "\u265A",
      Pb: "\u265F"
    },
    fontAwesomePro: {
      Rw: '<i class="far fa-fw fa-chess-rook"></i>',
      Nw: '<i class="far fa-fw fa-chess-knight"></i>',
      Bw: '<i class="far fa-fw fa-chess-bishop"></i>',
      Qw: '<i class="far fa-fw fa-chess-queen"></i>',
      Kw: '<i class="far fa-fw fa-chess-king"></i>',
      Pw: '<i class="far fa-fw fa-chess-pawn"></i>',
      Rb: '<i class="fas fa-fw fa-chess-rook"></i>',
      Nb: '<i class="fas fa-fw fa-chess-knight"></i>',
      Bb: '<i class="fas fa-fw fa-chess-bishop"></i>',
      Qb: '<i class="fas fa-fw fa-chess-queen"></i>',
      Kb: '<i class="fas fa-fw fa-chess-king"></i>',
      Pb: '<i class="fas fa-fw fa-chess-pawn"></i>'
    }
  }
};
var ChessRender = class {
  static san(san, color = COLOR2.white, lang = "en", mode = "text", pieces = PIECES2.figures.utf8) {
    if (mode === "figures") {
      if (color === COLOR2.white) {
        return this.replaceAll(san, {
          "R": pieces.Rw,
          "N": pieces.Nw,
          "B": pieces.Bw,
          "Q": pieces.Qw,
          "K": pieces.Kw
        });
      } else {
        return this.replaceAll(san, {
          "R": pieces.Rb,
          "N": pieces.Nb,
          "B": pieces.Bb,
          "Q": pieces.Qb,
          "K": pieces.Kb
        });
      }
    } else if (mode === "text") {
      return this.replaceAll(san, PIECES2.notation[lang]);
    } else {
      console.error("mode must be 'text' or 'figures'");
    }
  }
  static replaceAll(str, replacementsObj, ignoreCase = false) {
    let retStr = str;
    const flags = ignoreCase ? "gi" : "g";
    for (let needle in replacementsObj) {
      retStr = retStr.replace(new RegExp(needle, flags), replacementsObj[needle]);
    }
    return retStr;
  }
};

// node_modules/chess-console/src/components/History.js
var History2 = class extends UiComponent {
  constructor(chessConsole, props) {
    super(chessConsole.componentContainers.left.querySelector(".chess-console-history"), props);
    this.chessConsole = chessConsole;
    this.element = document.createElement("div");
    this.element.setAttribute("class", "history");
    this.context.appendChild(this.element);
    this.props = {
      notationType: "figures",
      makeClickable: true
    };
    Object.assign(this.props, props);
    this.chessConsole.state.observeChess(() => {
      this.redraw();
    });
    Observe.property(chessConsole.state, "plyViewed", () => {
      this.redraw();
    });
    if (this.props.makeClickable) {
      this.addClickEvents();
    }
    this.i18n = chessConsole.i18n;
    this.i18n.load({
      "de": {
        "game_history": "Spielnotation"
      },
      "en": {
        "game_history": "Game notation"
      }
    }).then(() => {
      this.redraw();
    });
  }
  addClickEvents() {
    this.clickHandler = DomUtils.delegate(this.element, "click", ".ply", (event) => {
      const ply = parseInt(event.target.getAttribute("data-ply"), 10);
      if (ply <= this.chessConsole.state.chess.history().length) {
        this.chessConsole.state.plyViewed = ply;
      }
    });
    this.element.classList.add("clickable");
  }
  removeClickEvents() {
    this.clickHandler.remove();
    this.element.classList.remove("clickable");
  }
  redraw() {
    window.clearTimeout(this.redrawDebounce);
    this.redrawDebounce = setTimeout(() => {
      const history = this.chessConsole.state.chess.history();
      let sanWhite;
      let sanBlack;
      let output = "";
      let i2;
      let rowClass = "";
      let whiteClass = "";
      let blackClass = "";
      for (i2 = 0; i2 < history.length; i2 += 2) {
        const moveWhite = history[i2];
        if (moveWhite) {
          sanWhite = ChessRender.san(moveWhite.san, COLOR2.white, this.chessConsole.i18n.lang, this.props.notationType, this.chessConsole.props.figures);
        }
        const moveBlack = history[i2 + 1];
        if (moveBlack) {
          sanBlack = ChessRender.san(moveBlack.san, COLOR2.black, this.chessConsole.i18n.lang, this.props.notationType, this.chessConsole.props.figures);
        } else {
          sanBlack = "";
        }
        if (this.chessConsole.state.plyViewed < i2 + 1) {
          whiteClass = "text-muted";
        }
        if (this.chessConsole.state.plyViewed === i2 + 1) {
          whiteClass = "active";
        }
        if (this.chessConsole.state.plyViewed < i2 + 2) {
          blackClass = "text-muted";
        }
        if (this.chessConsole.state.plyViewed === i2 + 2) {
          blackClass = "active";
        }
        output += "<tr><td class='num " + rowClass + "'>" + (i2 / 2 + 1) + ".</td><td data-ply='" + (i2 + 1) + "' class='ply " + whiteClass + " ply" + (i2 + 1) + "'>" + sanWhite + "</td><td data-ply='" + (i2 + 2) + "' class='ply " + blackClass + " ply" + (i2 + 2) + "'>" + sanBlack + "</td></tr>";
      }
      this.element.innerHTML = "<h2 class='visually-hidden'>" + this.i18n.t("game_history") + "</h2><table>" + output + "</table>";
      if (this.chessConsole.state.plyViewed > 0) {
        const $ply = $(this.element).find(".ply" + this.chessConsole.state.plyViewed);
        if ($ply.position()) {
          this.element.scrollTop = 0;
          this.element.scrollTop = $ply.position().top - 68;
        }
      }
    });
  }
};

// node_modules/chess-console/src/components/CapturedPieces.js
var zeroWithSpace = "&#8203;";
var CapturedPieces = class extends UiComponent {
  constructor(chessConsole) {
    super(chessConsole);
    this.chessConsole = chessConsole;
    this.element = document.createElement("div");
    this.element.setAttribute("class", "captured-pieces");
    this.chessConsole.componentContainers.left.querySelector(".chess-console-captured").appendChild(this.element);
    this.chessConsole.state.observeChess(() => {
      this.redraw();
    });
    Observe.property(this.chessConsole.state, "plyViewed", () => {
      this.redraw();
    });
    Observe.property(this.chessConsole.state, "orientation", () => {
      this.redraw();
    });
    this.i18n = chessConsole.i18n;
    this.i18n.load({
      "de": {
        "captured_pieces": "Geschlagene Figuren"
      },
      "en": {
        "captured_pieces": "Captured pieces"
      }
    }).then(() => {
      this.redraw();
    });
    DomUtils.delegate(this.element, "click", ".piece", (event) => {
      const ply = event.target.getAttribute("data-ply");
      this.chessConsole.state.plyViewed = parseInt(ply, 10);
    });
  }
  redraw() {
    window.clearTimeout(this.redrawDebounce);
    this.redrawDebounce = setTimeout(() => {
      const capturedPiecesWhite = [];
      const capturedPiecesWhiteAfterPlyViewed = [];
      const capturedPiecesBlack = [];
      const capturedPiecesBlackAfterPlyViewed = [];
      const history = this.chessConsole.state.chess.history({ verbose: true });
      let pointsWhite = 0;
      let pointsBlack = 0;
      history.forEach((move, index) => {
        if (move.flags.indexOf("c") !== -1 || move.flags.indexOf("e") !== -1) {
          const pieceCaptured = move.captured.toUpperCase();
          if (move.color === "b") {
            const pieceHtml = `<span class="piece" role='button' data-ply='${move.ply}'>` + this.chessConsole.props.figures[pieceCaptured + "w"] + "</span>";
            if (index < this.chessConsole.state.plyViewed) {
              capturedPiecesWhite.push(pieceHtml);
            } else {
              capturedPiecesWhiteAfterPlyViewed.push(pieceHtml);
            }
            pointsWhite += PIECES[pieceCaptured.toLowerCase()].value;
          } else if (move.color === "w") {
            const pieceHtml = `<span class="piece" role='button' data-ply='${move.ply}'>` + this.chessConsole.props.figures[pieceCaptured + "b"] + "</span>";
            if (index < this.chessConsole.state.plyViewed) {
              capturedPiecesBlack.push(pieceHtml);
            } else {
              capturedPiecesBlackAfterPlyViewed.push(pieceHtml);
            }
            pointsBlack += PIECES[pieceCaptured.toLowerCase()].value;
          }
        }
      });
      const outputWhite = this.renderPieces(capturedPiecesWhite, capturedPiecesWhiteAfterPlyViewed, pointsWhite);
      const outputBlack = this.renderPieces(capturedPiecesBlack, capturedPiecesBlackAfterPlyViewed, pointsBlack);
      this.element.innerHTML = "<h2 class='visually-hidden'>" + this.i18n.t("captured_pieces") + "</h2>" + (this.chessConsole.state.orientation === "w" ? outputWhite + outputBlack : outputBlack + outputWhite);
    });
  }
  renderPieces(capturedPieces, capturedPiecesAfterPlyViewed, points) {
    let output = "<div>";
    if (capturedPieces.length > 0) {
      output += capturedPieces.join(zeroWithSpace);
    }
    if (capturedPiecesAfterPlyViewed.length > 0) {
      output += "<span class='text-muted'>" + capturedPiecesAfterPlyViewed.join(zeroWithSpace) + "</span>";
    }
    output += "<small> " + (points > 0 ? points : "") + "</small></div>";
    return output;
  }
};

// node_modules/chess-console/src/components/HistoryControl.js
var HistoryControl = class extends UiComponent {
  constructor(chessConsole, props = {}) {
    super(chessConsole.componentContainers.controlButtons);
    this.chessConsole = chessConsole;
    const i18n = chessConsole.i18n;
    this.props = {
      autoPlayDelay: 1500
    };
    Object.assign(this.props, props);
    i18n.load({
      de: {
        "to_game_start": "Zum Spielstart",
        "one_move_back": "Ein Zug zur\xFCck",
        "one_move_forward": "Ein Zug weiter",
        "to_last_move": "Zum letzen Zug",
        "auto_run": "Automatisch abspielen",
        "turn_board": "Brett drehen"
      },
      en: {
        "to_game_start": "To game start",
        "one_move_back": "One move back",
        "one_move_forward": "One move forward",
        "to_last_move": "To last move",
        "auto_run": "Auto play",
        "turn_board": "Turn board"
      }
    }).then(() => {
      this.$btnFirst = $(`<button type="button" title="${i18n.t("to_game_start")}" class="btn btn-link text-black first"><i class="fa fa-fw fa-fast-backward" aria-hidden="true"></i></button>`);
      this.$btnBack = $(`<button type="button" title="${i18n.t("one_move_back")}" class="btn btn-link text-black back"><i class="fa fa-fw fa-step-backward" aria-hidden="true"></i></button>`);
      this.$btnForward = $(`<button type="button" title="${i18n.t("one_move_forward")}" class="btn btn-link text-black forward"><i class="fa fa-fw fa-step-forward" aria-hidden="true"></i></button>`);
      this.$btnLast = $(`<button type="button" title="${i18n.t("to_last_move")}" class="btn btn-link text-black last"><i class="fa fa-fw fa-fast-forward" aria-hidden="true"></i></button>`);
      this.$btnAutoplay = $(`<button type="button" title="${i18n.t("auto_run")}" class="btn btn-link text-black autoplay"><i class="fa fa-fw fa-play" aria-hidden="true"></i><i class="fa fa-fw fa-stop" aria-hidden="true"></i></button>`);
      this.$btnOrientation = $(`<button type="button" title="${i18n.t("turn_board")}" class="btn btn-link text-black orientation"><i class="fa fa-fw fa-exchange-alt fa-rotate-90" aria-hidden="true"></i></button>`);
      this.context.appendChild(this.$btnFirst[0]);
      this.context.appendChild(this.$btnBack[0]);
      this.context.appendChild(this.$btnForward[0]);
      this.context.appendChild(this.$btnLast[0]);
      this.context.appendChild(this.$btnAutoplay[0]);
      this.context.appendChild(this.$btnOrientation[0]);
      this.chessConsole.state.observeChess(() => {
        this.setButtonStates();
      });
      Observe.property(this.chessConsole.state, "plyViewed", () => {
        this.setButtonStates();
      });
      Observe.property(this.chessConsole.state, "orientation", () => {
        if (this.chessConsole.state.orientation !== this.chessConsole.props.playerColor) {
          this.$btnOrientation.addClass("btn-active");
        } else {
          this.$btnOrientation.removeClass("btn-active");
        }
      });
      this.$btnFirst.click(() => {
        this.chessConsole.state.plyViewed = 0;
        this.resetAutoPlay();
      });
      this.$btnBack.click(() => {
        this.chessConsole.state.plyViewed--;
        this.resetAutoPlay();
      });
      this.$btnForward.click(() => {
        this.chessConsole.state.plyViewed++;
        this.resetAutoPlay();
      });
      this.$btnLast.click(() => {
        this.chessConsole.state.plyViewed = this.chessConsole.state.chess.plyCount();
        this.resetAutoPlay();
      });
      this.$btnOrientation.click(() => {
        this.chessConsole.state.orientation = this.chessConsole.state.orientation === COLOR3.white ? COLOR3.black : COLOR3.white;
      });
      this.$btnAutoplay.click(() => {
        if (this.autoplay) {
          clearInterval(this.autoplay);
          this.autoplay = null;
        } else {
          this.chessConsole.state.plyViewed++;
          this.autoplay = setInterval(this.autoPlayMove.bind(this), this.props.autoPlayDelay);
        }
        this.updatePlayIcon();
      });
      this.setButtonStates();
    });
  }
  resetAutoPlay() {
    if (this.autoplay) {
      clearInterval(this.autoplay);
      this.autoplay = setInterval(this.autoPlayMove.bind(this), this.props.autoPlayDelay);
    }
  }
  autoPlayMove() {
    if (this.chessConsole.state.plyViewed >= this.chessConsole.state.chess.plyCount()) {
      clearInterval(this.autoplay);
      this.autoplay = null;
      this.updatePlayIcon();
    } else {
      this.chessConsole.state.plyViewed++;
      if (this.chessConsole.state.plyViewed >= this.chessConsole.state.chess.plyCount()) {
        clearInterval(this.autoplay);
        this.autoplay = null;
        this.updatePlayIcon();
      }
    }
  }
  updatePlayIcon() {
    const $playIcon = this.$btnAutoplay.find(".fa-play");
    const $stopIcon = this.$btnAutoplay.find(".fa-stop");
    if (this.autoplay) {
      $playIcon.hide();
      $stopIcon.show();
    } else {
      $playIcon.show();
      $stopIcon.hide();
    }
  }
  setButtonStates() {
    window.clearTimeout(this.redrawDebounce);
    this.redrawDebounce = setTimeout(() => {
      if (this.chessConsole.state.plyViewed > 0) {
        this.$btnFirst.prop("disabled", false);
        this.$btnBack.prop("disabled", false);
      } else {
        this.$btnFirst.prop("disabled", true);
        this.$btnBack.prop("disabled", true);
      }
      if (this.chessConsole.state.plyViewed < this.chessConsole.state.chess.plyCount()) {
        this.$btnLast.prop("disabled", false);
        this.$btnForward.prop("disabled", false);
        this.$btnAutoplay.prop("disabled", false);
      } else {
        this.$btnLast.prop("disabled", true);
        this.$btnForward.prop("disabled", true);
        this.$btnAutoplay.prop("disabled", true);
      }
    });
    this.updatePlayIcon();
  }
};

// node_modules/chess-console/src/components/Persistence.js
var Persistence = class extends Component {
  constructor(chessConsole, props) {
    super(props);
    this.chessConsole = chessConsole;
    if (!this.props.savePrefix) {
      this.props.savePrefix = "ChessConsole";
    }
    this.chessConsole.state.observeChess(() => {
      this.save();
    });
    this.chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.newGame, () => {
      this.save();
    });
    this.chessConsole.persistence = this;
  }
  load(prefix = this.props.savePrefix) {
    const props = {};
    try {
      if (this.loadValue("PlayerColor") !== null) {
        props.playerColor = this.loadValue("PlayerColor");
      } else {
        props.playerColor = COLOR2.white;
      }
      if (localStorage.getItem(prefix + "Pgn") !== null) {
        props.pgn = localStorage.getItem(prefix + "Pgn");
      }
      this.chessConsole.messageBroker.publish(CONSOLE_MESSAGE_TOPICS.load);
      this.chessConsole.initGame(props);
    } catch (e) {
      localStorage.clear();
      console.warn(e);
      this.chessConsole.initGame({ playerColor: COLOR2.white });
    }
  }
  loadValue(valueName, prefix = this.props.savePrefix) {
    let item = null;
    try {
      item = localStorage.getItem(prefix + valueName);
      return JSON.parse(item);
    } catch (e) {
      console.error("error loading ", prefix + valueName);
      console.error("item:" + item);
      console.error(e);
    }
  }
  save(prefix = this.props.savePrefix) {
    localStorage.setItem(prefix + "PlayerColor", JSON.stringify(this.chessConsole.props.playerColor));
    localStorage.setItem(prefix + "Pgn", this.chessConsole.state.chess.renderPgn());
  }
  saveValue(valueName, value, prefix = this.props.savePrefix) {
    localStorage.setItem(prefix + valueName, JSON.stringify(value));
  }
};

// node_modules/cm-web-modules/src/audio/Audio.js
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var mainGainNode = audioContext.createGain();
mainGainNode.gain.value = 1;
mainGainNode.connect(audioContext.destination);
var events = ["click", "touchstart", "touchend", "keydown", "mousedown", "mouseup", "dblclick"];
function addEventListeners() {
  events.forEach((event) => {
    document.addEventListener(event, resumeAudioContext);
  });
}
function removeEventListeners() {
  events.forEach((event) => {
    document.removeEventListener(event, resumeAudioContext);
  });
}
function resumeAudioContext() {
  if (audioContext.state !== "running") {
    audioContext.resume().then(() => {
      console.log("AudioContext resumed successfully, state:", audioContext.state);
      removeEventListeners();
    });
  }
}
console.log("AudioContext.state:", audioContext.state);
addEventListeners();
var Audio = class {
  static context() {
    return audioContext;
  }
  static destination() {
    return mainGainNode;
  }
  static setGain(gain) {
    mainGainNode.gain.setValueAtTime(gain, audioContext.currentTime);
  }
  static isEnabled() {
    return audioContext.state === "running";
  }
};

// node_modules/cm-web-modules/src/audio/Sample.js
var Sample = class {
  constructor(src, props = {}) {
    this.src = src;
    this.props = {
      gain: 1,
      startWithoutAudioContext: true
      // start to play, without enabled audio context
    };
    Object.assign(this.props, props);
    this.gainNode = Audio.context().createGain();
    this.setGain(this.props.gain);
    this.audioBuffer = null;
    this.load();
  }
  setGain(gain) {
    this.gainNode.gain.setValueAtTime(gain, Audio.context().currentTime);
  }
  play(when = void 0, offset = void 0, duration = void 0) {
    if (this.props.startWithoutAudioContext || Audio.isEnabled()) {
      this.loading.then(() => {
        let source;
        source = this.createBufferSource();
        source.start(when, offset, duration);
      });
    }
  }
  createBufferSource() {
    const source = Audio.context().createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(this.gainNode);
    this.gainNode.connect(Audio.destination());
    return source;
  }
  load() {
    this.loading = new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open("GET", this.src, true);
      request.responseType = "arraybuffer";
      request.onload = () => {
        Audio.context().decodeAudioData(request.response, (audioBuffer) => {
          this.audioBuffer = audioBuffer;
          resolve();
        }, () => {
          console.error("error loading sound", this.src);
          reject();
        });
      };
      request.send();
    });
    return this.loading;
  }
};

// node_modules/cm-web-modules/src/audio/AudioSprite.js
var AudioSprite = class extends Sample {
  play(sliceName, when = 0) {
    const slice = this.props.slices[sliceName];
    if (!slice) {
      throw new Error(`slice ${sliceName} not found in sprite`);
    }
    super.play(when, slice.offset, slice.duration);
  }
};

// node_modules/chess-console/src/components/Sound.js
var Sound = class extends Component {
  constructor(chessConsole, props) {
    super(props);
    this.chessConsole = chessConsole;
    this.audioSprite = new AudioSprite(
      this.props.soundSpriteFile,
      {
        gain: 1,
        slices: {
          "game_start": { offset: 0, duration: 0.9 },
          "game_won": { offset: 0.9, duration: 1.8 },
          "game_lost": { offset: 2.7, duration: 0.9 },
          "game_draw": { offset: 9.45, duration: 1.35 },
          "check": { offset: 3.6, duration: 0.45 },
          "wrong_move": { offset: 4.05, duration: 0.45 },
          "move": { offset: 4.5, duration: 0.2 },
          "capture": { offset: 6.3, duration: 0.2 },
          "castle": { offset: 7.65, duration: 0.2 },
          "take_back": { offset: 8.1, duration: 0.12 },
          "promotion": { offset: 9, duration: 0.45 },
          "dialog": { offset: 10.8, duration: 0.45 }
        }
      }
    );
    chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.initGame, () => {
    });
    chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.legalMove, (data) => {
      const chess = this.chessConsole.state.chess;
      const flags = data.moveResult.flags;
      if (flags.indexOf("p") !== -1) {
        this.play("promotion");
      } else if (flags.indexOf("c") !== -1) {
        this.play("capture");
      } else if (flags.indexOf("k") !== -1 || flags.indexOf("q") !== -1) {
        this.play("castle");
      } else {
        clearInterval(this.moveDebounced);
        this.moveDebounced = setTimeout(() => {
          this.play("move");
        }, 10);
      }
      if (chess.inCheck() || chess.inCheckmate()) {
        this.play("check");
      }
    });
    chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.illegalMove, () => {
      this.play("wrong_move");
    });
    chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.moveUndone, () => {
      this.play("take_back");
    });
    chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.gameOver, (data) => {
      setTimeout(() => {
        if (!data.wonColor) {
          this.play("game_lost");
        } else {
          if (data.wonColor === this.chessConsole.props.playerColor) {
            this.play("game_won");
          } else {
            this.play("game_lost");
          }
        }
      }, 500);
    });
    chessConsole.sound = this;
  }
  play(soundName) {
    this.audioSprite.play(soundName);
  }
};

// node_modules/bootstrap-show-modal/src/ShowModal.js
var Modal = class {
  constructor(props) {
    this.props = {
      title: "",
      // the dialog title html
      body: "",
      // the dialog body html
      footer: "",
      // the dialog footer html (mainly used for buttons)
      modalClass: "fade",
      // Additional css for ".modal", "fade" for fade effect
      modalDialogClass: "",
      // Additional css for ".modal-dialog", like "modal-lg" or "modal-sm" for sizing
      headerClass: "",
      // Additional css for ".modal-header"
      bodyClass: "",
      // Additional css for ".modal-body"
      footerClass: "",
      // Additional css for ".modal-footer"
      theme: void 0,
      // data-bs-theme
      options: {
        // The Bootstrap modal options as described here: https://getbootstrap.com/docs/4.0/components/modal/#options
        backdrop: "static"
        // disallow closing on click in the background
      },
      draggable: false,
      // make the dialog draggable
      // Events:
      onCreate: null,
      // Callback, called after the modal was created
      onShown: null,
      // Callback, called after the modal was shown and completely faded in
      onDispose: null,
      // Callback, called after the modal was disposed
      onSubmit: null
      // Callback of bootstrap.showConfirm(), called after yes or no was pressed
    };
    Object.assign(this.props, props);
    this.id = "bootstrap-show-modal-" + i;
    i++;
    this.show();
    if (this.props.onCreate) {
      this.props.onCreate(this);
    }
  }
  createContainerElement() {
    const self = this;
    this.element = document.createElement("div");
    this.element.id = this.id;
    let cssClass = "modal " + this.props.modalClass;
    if (this.props.theme === "dark") {
      cssClass += " text-light";
    }
    this.element.setAttribute("class", cssClass);
    this.element.setAttribute("tabindex", "-1");
    this.element.setAttribute("role", "dialog");
    this.element.setAttribute("aria-labelledby", this.id);
    if (this.props.theme) {
      this.element.setAttribute("data-bs-theme", this.props.theme);
    }
    this.element.innerHTML = `
<div class="modal-dialog ${this.props.modalDialogClass}" role="document">
    <div class="modal-content">
    <div class="modal-header ${this.props.headerClass}">
        <h5 class="modal-title"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body ${this.props.bodyClass}"></div>
    <div class="modal-footer ${this.props.footerClass}"></div>
    </div>
</div>`;
    document.body.appendChild(this.element);
    this.titleElement = this.element.querySelector(".modal-title");
    this.bodyElement = this.element.querySelector(".modal-body");
    this.footerElement = this.element.querySelector(".modal-footer");
    this.element.addEventListener("hidden.bs.modal", function() {
      self.dispose();
    });
    this.element.addEventListener("shown.bs.modal", function() {
      if (self.props.onShown) {
        self.props.onShown(self);
      }
    });
  }
  show() {
    if (!this.element) {
      this.createContainerElement();
      if (this.props.options) {
        const modalInstance = new bootstrap.Modal(this.element, this.props.options);
        if (modalInstance) {
          modalInstance.show();
        }
      } else {
        const modalInstance = new bootstrap.Modal(this.element);
        if (modalInstance) {
          modalInstance.show();
        }
      }
    } else {
      const modalInstance = bootstrap.Modal.getInstance(this.element);
      if (modalInstance) {
        modalInstance.show();
      }
    }
    if (this.props.title) {
      this.titleElement.style.display = "";
      this.titleElement.innerHTML = this.props.title;
    } else {
      this.titleElement.style.display = "none";
    }
    if (this.props.body) {
      this.bodyElement.style.display = "";
      this.bodyElement.innerHTML = this.props.body;
    } else {
      this.bodyElement.style.display = "none";
    }
    if (this.props.footer) {
      this.footerElement.style.display = "";
      this.footerElement.innerHTML = this.props.footer;
    } else {
      this.footerElement.style.display = "none";
    }
  }
  hide() {
    const modalInstance = bootstrap.Modal.getInstance(this.element);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
  dispose() {
    const modalInstance = bootstrap.Modal.getInstance(this.element);
    if (modalInstance) {
      modalInstance.dispose();
    }
    document.body.removeChild(this.element);
    if (this.props.onDispose) {
      this.props.onDispose(this);
    }
  }
};
var i = 0;
bootstrap.showModal = (props) => {
  if (props.buttons) {
    let footer = "";
    for (let key in props.buttons) {
      const buttonText = props.buttons[key];
      footer += `<button type="button" class="btn btn-primary" data-value="${key}" data-bs-dismiss="modal">${buttonText}</button>`;
    }
    props.footer = footer;
  }
  return new Modal(props);
};
bootstrap.showAlert = (props) => {
  props.buttons = { OK: "OK" };
  return bootstrap.showModal(props);
};
bootstrap.showConfirm = (props) => {
  props.footer = `<button class="btn btn-secondary btn-false btn-cancel">${props.textFalse}</button><button class="btn btn-primary btn-true">${props.textTrue}</button>`;
  props.onCreate = (modal) => {
    const modalInstance = bootstrap.Modal.getInstance(modal.element);
    modal.element.querySelector(".btn-false").addEventListener("click", function() {
      if (modalInstance) {
        modalInstance.hide();
      }
      modal.props.onSubmit(false, modal);
    });
    modal.element.querySelector(".btn-true").addEventListener("click", function() {
      if (modalInstance) {
        modalInstance.hide();
      }
      modal.props.onSubmit(true, modal);
    });
  };
  return bootstrap.showModal(props);
};

// node_modules/chess-console/src/components/GameControl/NewGameDialog.js
var NewGameDialog = class {
  constructor(module, props) {
    const i18n = module.i18n;
    i18n.load({
      de: {
        color: "Farbe",
        white: "Weiss",
        black: "Schwarz",
        auto: "automatisch"
      },
      en: {
        color: "Color",
        white: "White",
        black: "Black",
        auto: "automatically"
      }
    }).then(() => {
      const newGameColor = module.persistence.loadValue("newGameColor");
      props.modalClass = "fade";
      props.body = `<form class="form"><div class="form-group row">
                    <div class="col-3"><label for="color" class="col-form-label">${i18n.t("color")}</label></div>
                    <div class="col-9"><select id="color" class="form-select">
                        <option value="auto">${i18n.t("auto")}</option>
                        <option value="w" ${newGameColor === "w" ? "selected" : ""}>${i18n.t("white")}</option>
                        <option value="b" ${newGameColor === "b" ? "selected" : ""}>${i18n.t("black")}</option>
                    </select></div>
                </div></form>`;
      props.footer = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n.t("cancel")}</button>
            <button type="submit" class="btn btn-primary">${i18n.t("ok")}</button>`;
      props.onCreate = (modal) => {
        modal.element.querySelector("button[type='submit']").addEventListener("click", function(event) {
          event.preventDefault();
          const formElement = modal.element.querySelector(".form");
          let color = formElement.querySelector("#color").value;
          module.persistence.saveValue("newGameColor", color);
          if (color !== COLOR2.white && color !== COLOR2.black) {
            color = module.props.playerColor === COLOR2.white ? COLOR2.black : COLOR2.white;
          }
          modal.hide();
          module.newGame({ playerColor: color });
        });
      };
      bootstrap.showModal(props);
    });
  }
};

// node_modules/chess-console/src/components/GameControl/GameControl.js
var GameControl = class extends UiComponent {
  constructor(chessConsole, props) {
    super(chessConsole.componentContainers.controlButtons, props);
    this.chessConsole = chessConsole;
    const i18n = chessConsole.i18n;
    i18n.load({
      de: {
        "start_game": "Ein neues Spiel starten",
        "undo_move": "Zug zur\xFCck nehmen"
      },
      en: {
        "start_game": "Start a new game",
        "undo_move": "Undo move"
      }
    }).then(() => {
      this.$btnUndoMove = $(`<button type="button" title="${i18n.t("undo_move")}" class="btn btn-icon btn-light undoMove"><i class="fa fa-fw fa-undo-alt" aria-hidden="true"></i></button>`);
      this.$btnStartNewGame = $(`<button type="button" title="${i18n.t("start_game")}" class="btn btn-icon btn-light startNewGame"><i class="fa fa-fw fa-plus" aria-hidden="true"></i></button>\`)`);
      this.context.appendChild(this.$btnUndoMove[0]);
      this.context.appendChild(this.$btnStartNewGame[0]);
      this.$btnUndoMove.click(() => {
        this.chessConsole.undoMove();
      });
      this.$btnStartNewGame.click(() => {
        this.showNewGameDialog();
      });
      this.chessConsole.state.observeChess(() => {
        this.setButtonStates();
      });
      this.setButtonStates();
    });
  }
  showNewGameDialog() {
    new NewGameDialog(this.chessConsole, {
      title: this.chessConsole.i18n.t("start_game")
    });
  }
  setButtonStates() {
    if (this.chessConsole.state.chess.plyCount() < 2) {
      this.$btnUndoMove.prop("disabled", true);
    } else {
      this.$btnUndoMove.prop("disabled", false);
    }
  }
};

// node_modules/cm-engine-runner/src/EngineRunner.js
var ENGINE_STATE = {
  LOADING: 1,
  LOADED: 2,
  READY: 3,
  THINKING: 4
};
var EngineRunner = class {
  constructor(props) {
    this.props = {
      debug: false,
      responseDelay: 1e3
      // https://www.reddit.com/r/ProgrammerHumor/comments/6xwely/from_the_apple_chess_engine_code/
      // https://opensource.apple.com/source/Chess/Chess-347/Sources/MBCEngine.mm.auto.html
    };
    Object.assign(this.props, props);
    this.engineState = ENGINE_STATE.LOADING;
    this.initialized = this.init();
    this.initialization = this.initialized;
  }
  init() {
    return Promise.reject("you have to implement `init()` in the EngineRunner");
  }
  calculateMove(fen, props = {}) {
  }
};

// node_modules/cm-engine-runner/src/StockfishRunner.js
var LEVELS = {
  1: [3, 0],
  2: [3, 1],
  3: [4, 2],
  4: [5, 3],
  5: [5, 4],
  6: [6, 5],
  7: [7, 6],
  8: [8, 7],
  9: [9, 8],
  10: [10, 10],
  11: [11, 11],
  12: [12, 12],
  13: [13, 13],
  14: [14, 14],
  15: [15, 15],
  16: [16, 16],
  17: [17, 17],
  18: [18, 18],
  19: [19, 19],
  20: [20, 20]
};
var StockfishRunner = class extends EngineRunner {
  constructor(props) {
    super(props);
  }
  init() {
    return new Promise((resolve) => {
      const listener = (event) => {
        this.workerListener(event);
      };
      if (this.engineWorker) {
        this.engineWorker.removeEventListener("message", listener);
        this.engineWorker.terminate();
      }
      this.engineWorker = new Worker(this.props.workerUrl);
      this.engineWorker.addEventListener("message", listener);
      this.uciCmd("uci");
      this.uciCmd("ucinewgame");
      this.uciCmd("isready");
      resolve();
    });
  }
  workerListener(event) {
    if (this.props.debug) {
      if (event.type === "message") {
        console.log("  msg", event.data);
      } else {
        console.log(event);
      }
    }
    const line = event.data;
    if (line === "uciok") {
      this.engineState = ENGINE_STATE.LOADED;
    } else if (line === "readyok") {
      this.engineState = ENGINE_STATE.READY;
    } else {
      let match = line.match(/^info .*\bscore (\w+) (-?\d+)/);
      if (match) {
        const score = parseInt(match[2], 10);
        let tmpScore;
        if (match[1] === "cp") {
          tmpScore = (score / 100).toFixed(1);
        } else if (match[1] === "mate") {
          tmpScore = "#" + Math.abs(score);
        }
        this.score = tmpScore;
      }
      match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?( ponder ([a-h][1-8])?([a-h][1-8])?)?/);
      if (match) {
        this.engineState = ENGINE_STATE.READY;
        if (match[4] !== void 0) {
          this.ponder = { from: match[5], to: match[6] };
        } else {
          this.ponder = void 0;
        }
        const move = { from: match[1], to: match[2], promotion: match[3], score: this.score, ponder: this.ponder };
        this.moveResponse(move);
      } else {
        match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/);
        if (match) {
          this.engineState = ENGINE_STATE.THINKING;
          this.search = "Depth: " + match[1] + " Nps: " + match[2];
        }
      }
    }
  }
  calculateMove(fen, props = { level: 4 }) {
    this.engineState = ENGINE_STATE.THINKING;
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(async () => {
        resolve();
      }, this.props.responseDelay);
    });
    const calculationPromise = new Promise((resolve) => {
      setTimeout(() => {
        this.uciCmd("setoption name Skill Level value " + LEVELS[props.level][1]);
        this.uciCmd("position fen " + fen);
        this.uciCmd("go depth " + LEVELS[props.level][0]);
        this.moveResponse = (move) => {
          resolve(move);
        };
      }, this.props.responseDelay);
    });
    return new Promise((resolve) => {
      Promise.all([this.initialisation, timeoutPromise, calculationPromise]).then((values) => {
        this.engineState = ENGINE_STATE.READY;
        resolve(values[2]);
      });
    });
  }
  uciCmd(cmd) {
    if (this.props.debug) {
      console.log("  uci ->", cmd);
    }
    this.engineWorker.postMessage(cmd);
  }
};

// src/StockfishNewGameDialog.js
var StockfishNewGameDialog = class {
  constructor(chessConsole, props) {
    this.chessConsole = chessConsole;
    this.props = props;
    const i18n = chessConsole.i18n;
    i18n.load({
      de: {
        color: "Farbe",
        white: "Weiss",
        black: "Schwarz",
        auto: "Automatisch wechselnd",
        random: "Zufallsauswahl"
      },
      en: {
        color: "Color",
        white: "white",
        black: "black",
        auto: "automatically alternating",
        random: "random"
      }
    }).then(() => {
      const newGameColor = chessConsole.persistence.loadValue("newGameColor");
      props.modalClass = "fade";
      props.body = `<div class="form"><div class="form-group row">
                        <div class="col-3"><label for="color" class="col-form-label">${i18n.t("color")}</label></div>
                        <div class="col-9"><select id="color" class="form-control">
                        <option value="w" ${newGameColor === "w" ? "selected" : ""}>${i18n.t("white")}</option>
                        <option value="b" ${newGameColor === "b" ? "selected" : ""}>${i18n.t("black")}</option>
                        <option value="random" ${newGameColor === "random" ? "selected" : ""}>${i18n.t("random")}</option>
                        <option value="auto" ${newGameColor === "auto" ? "selected" : ""}>${i18n.t("auto")}</option>
                        </select></div>
                        </div>
                        <div class="form-group row">
                        <div class="col-3"><label for="level" class="col-form-label">${i18n.t("level")}</label></div>
                        <div class="col-9"><select id="level" class="form-control">
                        ${this.renderLevelOptions()}
                        </select></div>
                        </div></div>`;
      props.footer = `<button type="button" class="btn btn-link" data-dismiss="modal">${i18n.t("cancel")}</button>
            <button type="submit" class="btn btn-primary">${i18n.t("ok")}</button>`;
      props.onCreate = (modal) => {
        $(modal.element).on("click", "button[type='submit']", function(event) {
          event.preventDefault();
          const $form = $(modal.element).find(".form");
          let color = $form.find("#color").val();
          chessConsole.persistence.saveValue("newGameColor", color);
          const level = parseInt($form.find("#level").val(), 10) || 1;
          if (color === "auto") {
            color = chessConsole.props.playerColor === COLOR.white ? COLOR.black : COLOR.white;
          } else if (color === "random") {
            color = "wb".charAt(Math.floor(Math.random() * 2));
          }
          modal.hide();
          chessConsole.newGame({ playerColor: color, engineLevel: level });
        });
      };
      bootstrap.showModal(props);
    });
  }
  renderLevelOptions() {
    let html = "";
    const currentLevel = this.props.player.state.level;
    const levels = Object.keys(LEVELS);
    for (let i2 = levels[0]; i2 <= levels[levels.length - 1]; i2++) {
      let selected = "";
      if (currentLevel === i2) {
        selected = "selected ";
      }
      html += "<option " + selected + 'value="' + i2 + '">Level ' + i2 + "</option>";
    }
    return html;
  }
};

// src/StockfishGameControl.js
var StockfishGameControl = class extends GameControl {
  showNewGameDialog() {
    new StockfishNewGameDialog(this.chessConsole, {
      title: this.chessConsole.i18n.t("start_game"),
      player: this.props.player
    });
  }
};

// node_modules/cm-polyglot/lib/stakelbase/Book.js
var BookEntry = class {
  // Build one BookEntry from the binary data slurped from
  // a polyglot opening book starting at byte-offset 'ofs'
  constructor(bookdata, ofs) {
    this.ofs = ofs;
    let key = BigInt(0);
    let i2;
    let byt;
    for (i2 = 0; i2 < 8; ++i2) {
      byt = bookdata.charCodeAt(ofs++);
      key = key << BigInt(8) | BigInt(byt);
    }
    this.key = key;
    let raw_move = 0;
    for (i2 = 0; i2 < 2; ++i2) {
      byt = bookdata.charCodeAt(ofs++);
      raw_move = raw_move << 8 | byt;
    }
    this.raw_move = raw_move;
    let weight = 0;
    for (i2 = 0; i2 < 2; ++i2) {
      byt = bookdata.charCodeAt(ofs++);
      weight = weight << 8 | byt;
    }
    this.weight = weight;
    let learn = 0;
    for (i2 = 0; i2 < 4; ++i2) {
      byt = bookdata.charCodeAt(ofs++);
      learn = learn << 8 | byt;
    }
    this.learn = learn;
  }
  get_key() {
    return this.key;
  }
  get_from_row() {
    return this.raw_move >> 9 & 7;
  }
  get_from_col() {
    return this.raw_move >> 6 & 7;
  }
  get_to_row() {
    return this.raw_move >> 3 & 7;
  }
  get_to_col() {
    return this.raw_move & 7;
  }
  get_promo_piece() {
    return this.raw_move >> 12 & 7;
  }
  // Polyglot uses its own convention for castling: provide
  // accessor methods for finding out which type of castling
  // is encoded in current move.
  isOOW() {
    return this.raw_move === 263;
  }
  isOOB() {
    return this.raw_move === 3903;
  }
  isOOOW() {
    return this.raw_move === 256;
  }
  isOOOB() {
    return this.raw_move === 3896;
  }
};
var Book = class {
  constructor(bookdata) {
    this.bookdata = bookdata;
    this.cache = [];
    if (this.bookdata.length >= 32) {
      this.first = new BookEntry(this.bookdata, 0);
      this.last = new BookEntry(this.bookdata, this.get_last_index());
    } else {
      this.first = null;
      this.last = null;
    }
  }
  get_length() {
    return this.bookdata.length / 16;
  }
  get_last_index() {
    return this.get_length() - 1;
  }
  get_offset(idx) {
    return idx * 16;
  }
  get_entry(idx) {
    let e;
    if (this.cache[idx] === void 0) {
      e = new BookEntry(this.bookdata, this.get_offset(idx));
      this.cache[idx] = e;
    } else {
      e = this.cache[idx];
    }
    return e;
  }
  // Retrieve the index of the first occurrence of the specified hash,
  // or -1 if not found.
  //
  // weed = BigInt (64-bit integer) with the hash to locate
  find_first_hash(weed) {
    if (this.first === null || this.last === null) {
      return -1;
    }
    if (weed < this.first || weed > this.last) {
      return -1;
    }
    if (weed === this.first) {
      return 0;
    }
    let i0 = 0;
    let i1 = this.bookdata.length / 16 - 1;
    let i2 = i1;
    let ky = 0n;
    if (weed !== this.last) {
      while (i1 - i0 > 1) {
        i2 = Math.floor((i0 + i1) / 2);
        const e = this.get_entry(i2);
        ky = e.get_key();
        if (ky === weed) {
          break;
        }
        if (ky < weed) {
          i0 = i2;
        } else {
          i1 = i2;
        }
      }
    }
    if (ky !== weed) {
      return -1;
    }
    while (i2 > 0) {
      if (this.get_entry(i2 - 1).get_key() === weed) {
        i2 = i2 - 1;
      } else {
        break;
      }
    }
    return i2;
  }
  // Get all entries for given hash
  get_all_moves(weed) {
    let i2 = this.find_first_hash(weed);
    if (i2 < 0) {
      return [];
    }
    const lst = [];
    let e = this.get_entry(i2);
    while (e !== void 0 && e.get_key() === weed) {
      lst.push(e);
      e = this.get_entry(++i2);
    }
    return lst;
  }
};

// node_modules/cm-polyglot/lib/stakelbase/KeyGenerator.js
var random64 = [
  0x9D39247E33776D41n,
  0x2AF7398005AAA5C7n,
  0x44DB015024623547n,
  0x9C15F73E62A76AE2n,
  0x75834465489C0C89n,
  0x3290AC3A203001BFn,
  0x0FBBAD1F61042279n,
  0xE83A908FF2FB60CAn,
  0x0D7E765D58755C10n,
  0x1A083822CEAFE02Dn,
  0x9605D5F0E25EC3B0n,
  0xD021FF5CD13A2ED5n,
  0x40BDF15D4A672E32n,
  0x011355146FD56395n,
  0x5DB4832046F3D9E5n,
  0x239F8B2D7FF719CCn,
  0x05D1A1AE85B49AA1n,
  0x679F848F6E8FC971n,
  0x7449BBFF801FED0Bn,
  0x7D11CDB1C3B7ADF0n,
  0x82C7709E781EB7CCn,
  0xF3218F1C9510786Cn,
  0x331478F3AF51BBE6n,
  0x4BB38DE5E7219443n,
  0xAA649C6EBCFD50FCn,
  0x8DBD98A352AFD40Bn,
  0x87D2074B81D79217n,
  0x19F3C751D3E92AE1n,
  0xB4AB30F062B19ABFn,
  0x7B0500AC42047AC4n,
  0xC9452CA81A09D85Dn,
  0x24AA6C514DA27500n,
  0x4C9F34427501B447n,
  0x14A68FD73C910841n,
  0xA71B9B83461CBD93n,
  0x03488B95B0F1850Fn,
  0x637B2B34FF93C040n,
  0x09D1BC9A3DD90A94n,
  0x3575668334A1DD3Bn,
  0x735E2B97A4C45A23n,
  0x18727070F1BD400Bn,
  0x1FCBACD259BF02E7n,
  0xD310A7C2CE9B6555n,
  0xBF983FE0FE5D8244n,
  0x9F74D14F7454A824n,
  0x51EBDC4AB9BA3035n,
  0x5C82C505DB9AB0FAn,
  0xFCF7FE8A3430B241n,
  0x3253A729B9BA3DDEn,
  0x8C74C368081B3075n,
  0xB9BC6C87167C33E7n,
  0x7EF48F2B83024E20n,
  0x11D505D4C351BD7Fn,
  0x6568FCA92C76A243n,
  0x4DE0B0F40F32A7B8n,
  0x96D693460CC37E5Dn,
  0x42E240CB63689F2Fn,
  0x6D2BDCDAE2919661n,
  0x42880B0236E4D951n,
  0x5F0F4A5898171BB6n,
  0x39F890F579F92F88n,
  0x93C5B5F47356388Bn,
  0x63DC359D8D231B78n,
  0xEC16CA8AEA98AD76n,
  0x5355F900C2A82DC7n,
  0x07FB9F855A997142n,
  0x5093417AA8A7ED5En,
  0x7BCBC38DA25A7F3Cn,
  0x19FC8A768CF4B6D4n,
  0x637A7780DECFC0D9n,
  0x8249A47AEE0E41F7n,
  0x79AD695501E7D1E8n,
  0x14ACBAF4777D5776n,
  0xF145B6BECCDEA195n,
  0xDABF2AC8201752FCn,
  0x24C3C94DF9C8D3F6n,
  0xBB6E2924F03912EAn,
  0x0CE26C0B95C980D9n,
  0xA49CD132BFBF7CC4n,
  0xE99D662AF4243939n,
  0x27E6AD7891165C3Fn,
  0x8535F040B9744FF1n,
  0x54B3F4FA5F40D873n,
  0x72B12C32127FED2Bn,
  0xEE954D3C7B411F47n,
  0x9A85AC909A24EAA1n,
  0x70AC4CD9F04F21F5n,
  0xF9B89D3E99A075C2n,
  0x87B3E2B2B5C907B1n,
  0xA366E5B8C54F48B8n,
  0xAE4A9346CC3F7CF2n,
  0x1920C04D47267BBDn,
  0x87BF02C6B49E2AE9n,
  0x092237AC237F3859n,
  0xFF07F64EF8ED14D0n,
  0x8DE8DCA9F03CC54En,
  0x9C1633264DB49C89n,
  0xB3F22C3D0B0B38EDn,
  0x390E5FB44D01144Bn,
  0x5BFEA5B4712768E9n,
  0x1E1032911FA78984n,
  0x9A74ACB964E78CB3n,
  0x4F80F7A035DAFB04n,
  0x6304D09A0B3738C4n,
  0x2171E64683023A08n,
  0x5B9B63EB9CEFF80Cn,
  0x506AACF489889342n,
  0x1881AFC9A3A701D6n,
  0x6503080440750644n,
  0xDFD395339CDBF4A7n,
  0xEF927DBCF00C20F2n,
  0x7B32F7D1E03680ECn,
  0xB9FD7620E7316243n,
  0x05A7E8A57DB91B77n,
  0xB5889C6E15630A75n,
  0x4A750A09CE9573F7n,
  0xCF464CEC899A2F8An,
  0xF538639CE705B824n,
  0x3C79A0FF5580EF7Fn,
  0xEDE6C87F8477609Dn,
  0x799E81F05BC93F31n,
  0x86536B8CF3428A8Cn,
  0x97D7374C60087B73n,
  0xA246637CFF328532n,
  0x043FCAE60CC0EBA0n,
  0x920E449535DD359En,
  0x70EB093B15B290CCn,
  0x73A1921916591CBDn,
  0x56436C9FE1A1AA8Dn,
  0xEFAC4B70633B8F81n,
  0xBB215798D45DF7AFn,
  0x45F20042F24F1768n,
  0x930F80F4E8EB7462n,
  0xFF6712FFCFD75EA1n,
  0xAE623FD67468AA70n,
  0xDD2C5BC84BC8D8FCn,
  0x7EED120D54CF2DD9n,
  0x22FE545401165F1Cn,
  0xC91800E98FB99929n,
  0x808BD68E6AC10365n,
  0xDEC468145B7605F6n,
  0x1BEDE3A3AEF53302n,
  0x43539603D6C55602n,
  0xAA969B5C691CCB7An,
  0xA87832D392EFEE56n,
  0x65942C7B3C7E11AEn,
  0xDED2D633CAD004F6n,
  0x21F08570F420E565n,
  0xB415938D7DA94E3Cn,
  0x91B859E59ECB6350n,
  0x10CFF333E0ED804An,
  0x28AED140BE0BB7DDn,
  0xC5CC1D89724FA456n,
  0x5648F680F11A2741n,
  0x2D255069F0B7DAB3n,
  0x9BC5A38EF729ABD4n,
  0xEF2F054308F6A2BCn,
  0xAF2042F5CC5C2858n,
  0x480412BAB7F5BE2An,
  0xAEF3AF4A563DFE43n,
  0x19AFE59AE451497Fn,
  0x52593803DFF1E840n,
  0xF4F076E65F2CE6F0n,
  0x11379625747D5AF3n,
  0xBCE5D2248682C115n,
  0x9DA4243DE836994Fn,
  0x066F70B33FE09017n,
  0x4DC4DE189B671A1Cn,
  0x51039AB7712457C3n,
  0xC07A3F80C31FB4B4n,
  0xB46EE9C5E64A6E7Cn,
  0xB3819A42ABE61C87n,
  0x21A007933A522A20n,
  0x2DF16F761598AA4Fn,
  0x763C4A1371B368FDn,
  0xF793C46702E086A0n,
  0xD7288E012AEB8D31n,
  0xDE336A2A4BC1C44Bn,
  0x0BF692B38D079F23n,
  0x2C604A7A177326B3n,
  0x4850E73E03EB6064n,
  0xCFC447F1E53C8E1Bn,
  0xB05CA3F564268D99n,
  0x9AE182C8BC9474E8n,
  0xA4FC4BD4FC5558CAn,
  0xE755178D58FC4E76n,
  0x69B97DB1A4C03DFEn,
  0xF9B5B7C4ACC67C96n,
  0xFC6A82D64B8655FBn,
  0x9C684CB6C4D24417n,
  0x8EC97D2917456ED0n,
  0x6703DF9D2924E97En,
  0xC547F57E42A7444En,
  0x78E37644E7CAD29En,
  0xFE9A44E9362F05FAn,
  0x08BD35CC38336615n,
  0x9315E5EB3A129ACEn,
  0x94061B871E04DF75n,
  0xDF1D9F9D784BA010n,
  0x3BBA57B68871B59Dn,
  0xD2B7ADEEDED1F73Fn,
  0xF7A255D83BC373F8n,
  0xD7F4F2448C0CEB81n,
  0xD95BE88CD210FFA7n,
  0x336F52F8FF4728E7n,
  0xA74049DAC312AC71n,
  0xA2F61BB6E437FDB5n,
  0x4F2A5CB07F6A35B3n,
  0x87D380BDA5BF7859n,
  0x16B9F7E06C453A21n,
  0x7BA2484C8A0FD54En,
  0xF3A678CAD9A2E38Cn,
  0x39B0BF7DDE437BA2n,
  0xFCAF55C1BF8A4424n,
  0x18FCF680573FA594n,
  0x4C0563B89F495AC3n,
  0x40E087931A00930Dn,
  0x8CFFA9412EB642C1n,
  0x68CA39053261169Fn,
  0x7A1EE967D27579E2n,
  0x9D1D60E5076F5B6Fn,
  0x3810E399B6F65BA2n,
  0x32095B6D4AB5F9B1n,
  0x35CAB62109DD038An,
  0xA90B24499FCFAFB1n,
  0x77A225A07CC2C6BDn,
  0x513E5E634C70E331n,
  0x4361C0CA3F692F12n,
  0xD941ACA44B20A45Bn,
  0x528F7C8602C5807Bn,
  0x52AB92BEB9613989n,
  0x9D1DFA2EFC557F73n,
  0x722FF175F572C348n,
  0x1D1260A51107FE97n,
  0x7A249A57EC0C9BA2n,
  0x04208FE9E8F7F2D6n,
  0x5A110C6058B920A0n,
  0x0CD9A497658A5698n,
  0x56FD23C8F9715A4Cn,
  0x284C847B9D887AAEn,
  0x04FEABFBBDB619CBn,
  0x742E1E651C60BA83n,
  0x9A9632E65904AD3Cn,
  0x881B82A13B51B9E2n,
  0x506E6744CD974924n,
  0xB0183DB56FFC6A79n,
  0x0ED9B915C66ED37En,
  0x5E11E86D5873D484n,
  0xF678647E3519AC6En,
  0x1B85D488D0F20CC5n,
  0xDAB9FE6525D89021n,
  0x0D151D86ADB73615n,
  0xA865A54EDCC0F019n,
  0x93C42566AEF98FFBn,
  0x99E7AFEABE000731n,
  0x48CBFF086DDF285An,
  0x7F9B6AF1EBF78BAFn,
  0x58627E1A149BBA21n,
  0x2CD16E2ABD791E33n,
  0xD363EFF5F0977996n,
  0x0CE2A38C344A6EEDn,
  0x1A804AADB9CFA741n,
  0x907F30421D78C5DEn,
  0x501F65EDB3034D07n,
  0x37624AE5A48FA6E9n,
  0x957BAF61700CFF4En,
  0x3A6C27934E31188An,
  0xD49503536ABCA345n,
  0x088E049589C432E0n,
  0xF943AEE7FEBF21B8n,
  0x6C3B8E3E336139D3n,
  0x364F6FFA464EE52En,
  0xD60F6DCEDC314222n,
  0x56963B0DCA418FC0n,
  0x16F50EDF91E513AFn,
  0xEF1955914B609F93n,
  0x565601C0364E3228n,
  0xECB53939887E8175n,
  0xBAC7A9A18531294Bn,
  0xB344C470397BBA52n,
  0x65D34954DAF3CEBDn,
  0xB4B81B3FA97511E2n,
  0xB422061193D6F6A7n,
  0x071582401C38434Dn,
  0x7A13F18BBEDC4FF5n,
  0xBC4097B116C524D2n,
  0x59B97885E2F2EA28n,
  0x99170A5DC3115544n,
  0x6F423357E7C6A9F9n,
  0x325928EE6E6F8794n,
  0xD0E4366228B03343n,
  0x565C31F7DE89EA27n,
  0x30F5611484119414n,
  0xD873DB391292ED4Fn,
  0x7BD94E1D8E17DEBCn,
  0xC7D9F16864A76E94n,
  0x947AE053EE56E63Cn,
  0xC8C93882F9475F5Fn,
  0x3A9BF55BA91F81CAn,
  0xD9A11FBB3D9808E4n,
  0x0FD22063EDC29FCAn,
  0xB3F256D8ACA0B0B9n,
  0xB03031A8B4516E84n,
  0x35DD37D5871448AFn,
  0xE9F6082B05542E4En,
  0xEBFAFA33D7254B59n,
  0x9255ABB50D532280n,
  0xB9AB4CE57F2D34F3n,
  0x693501D628297551n,
  0xC62C58F97DD949BFn,
  0xCD454F8F19C5126An,
  0xBBE83F4ECC2BDECBn,
  0xDC842B7E2819E230n,
  0xBA89142E007503B8n,
  0xA3BC941D0A5061CBn,
  0xE9F6760E32CD8021n,
  0x09C7E552BC76492Fn,
  0x852F54934DA55CC9n,
  0x8107FCCF064FCF56n,
  0x098954D51FFF6580n,
  0x23B70EDB1955C4BFn,
  0xC330DE426430F69Dn,
  0x4715ED43E8A45C0An,
  0xA8D7E4DAB780A08Dn,
  0x0572B974F03CE0BBn,
  0xB57D2E985E1419C7n,
  0xE8D9ECBE2CF3D73Fn,
  0x2FE4B17170E59750n,
  0x11317BA87905E790n,
  0x7FBF21EC8A1F45ECn,
  0x1725CABFCB045B00n,
  0x964E915CD5E2B207n,
  0x3E2B8BCBF016D66Dn,
  0xBE7444E39328A0ACn,
  0xF85B2B4FBCDE44B7n,
  0x49353FEA39BA63B1n,
  0x1DD01AAFCD53486An,
  0x1FCA8A92FD719F85n,
  0xFC7C95D827357AFAn,
  0x18A6A990C8B35EBDn,
  0xCCCB7005C6B9C28Dn,
  0x3BDBB92C43B17F26n,
  0xAA70B5B4F89695A2n,
  0xE94C39A54A98307Fn,
  0xB7A0B174CFF6F36En,
  0xD4DBA84729AF48ADn,
  0x2E18BC1AD9704A68n,
  0x2DE0966DAF2F8B1Cn,
  0xB9C11D5B1E43A07En,
  0x64972D68DEE33360n,
  0x94628D38D0C20584n,
  0xDBC0D2B6AB90A559n,
  0xD2733C4335C6A72Fn,
  0x7E75D99D94A70F4Dn,
  0x6CED1983376FA72Bn,
  0x97FCAACBF030BC24n,
  0x7B77497B32503B12n,
  0x8547EDDFB81CCB94n,
  0x79999CDFF70902CBn,
  0xCFFE1939438E9B24n,
  0x829626E3892D95D7n,
  0x92FAE24291F2B3F1n,
  0x63E22C147B9C3403n,
  0xC678B6D860284A1Cn,
  0x5873888850659AE7n,
  0x0981DCD296A8736Dn,
  0x9F65789A6509A440n,
  0x9FF38FED72E9052Fn,
  0xE479EE5B9930578Cn,
  0xE7F28ECD2D49EECDn,
  0x56C074A581EA17FEn,
  0x5544F7D774B14AEFn,
  0x7B3F0195FC6F290Fn,
  0x12153635B2C0CF57n,
  0x7F5126DBBA5E0CA7n,
  0x7A76956C3EAFB413n,
  0x3D5774A11D31AB39n,
  0x8A1B083821F40CB4n,
  0x7B4A38E32537DF62n,
  0x950113646D1D6E03n,
  0x4DA8979A0041E8A9n,
  0x3BC36E078F7515D7n,
  0x5D0A12F27AD310D1n,
  0x7F9D1A2E1EBE1327n,
  0xDA3A361B1C5157B1n,
  0xDCDD7D20903D0C25n,
  0x36833336D068F707n,
  0xCE68341F79893389n,
  0xAB9090168DD05F34n,
  0x43954B3252DC25E5n,
  0xB438C2B67F98E5E9n,
  0x10DCD78E3851A492n,
  0xDBC27AB5447822BFn,
  0x9B3CDB65F82CA382n,
  0xB67B7896167B4C84n,
  0xBFCED1B0048EAC50n,
  0xA9119B60369FFEBDn,
  0x1FFF7AC80904BF45n,
  0xAC12FB171817EEE7n,
  0xAF08DA9177DDA93Dn,
  0x1B0CAB936E65C744n,
  0xB559EB1D04E5E932n,
  0xC37B45B3F8D6F2BAn,
  0xC3A9DC228CAAC9E9n,
  0xF3B8B6675A6507FFn,
  0x9FC477DE4ED681DAn,
  0x67378D8ECCEF96CBn,
  0x6DD856D94D259236n,
  0xA319CE15B0B4DB31n,
  0x073973751F12DD5En,
  0x8A8E849EB32781A5n,
  0xE1925C71285279F5n,
  0x74C04BF1790C0EFEn,
  0x4DDA48153C94938An,
  0x9D266D6A1CC0542Cn,
  0x7440FB816508C4FEn,
  0x13328503DF48229Fn,
  0xD6BF7BAEE43CAC40n,
  0x4838D65F6EF6748Fn,
  0x1E152328F3318DEAn,
  0x8F8419A348F296BFn,
  0x72C8834A5957B511n,
  0xD7A023A73260B45Cn,
  0x94EBC8ABCFB56DAEn,
  0x9FC10D0F989993E0n,
  0xDE68A2355B93CAE6n,
  0xA44CFE79AE538BBEn,
  0x9D1D84FCCE371425n,
  0x51D2B1AB2DDFB636n,
  0x2FD7E4B9E72CD38Cn,
  0x65CA5B96B7552210n,
  0xDD69A0D8AB3B546Dn,
  0x604D51B25FBF70E2n,
  0x73AA8A564FB7AC9En,
  0x1A8C1E992B941148n,
  0xAAC40A2703D9BEA0n,
  0x764DBEAE7FA4F3A6n,
  0x1E99B96E70A9BE8Bn,
  0x2C5E9DEB57EF4743n,
  0x3A938FEE32D29981n,
  0x26E6DB8FFDF5ADFEn,
  0x469356C504EC9F9Dn,
  0xC8763C5B08D1908Cn,
  0x3F6C6AF859D80055n,
  0x7F7CC39420A3A545n,
  0x9BFB227EBDF4C5CEn,
  0x89039D79D6FC5C5Cn,
  0x8FE88B57305E2AB6n,
  0xA09E8C8C35AB96DEn,
  0xFA7E393983325753n,
  0xD6B6D0ECC617C699n,
  0xDFEA21EA9E7557E3n,
  0xB67C1FA481680AF8n,
  0xCA1E3785A9E724E5n,
  0x1CFC8BED0D681639n,
  0xD18D8549D140CAEAn,
  0x4ED0FE7E9DC91335n,
  0xE4DBF0634473F5D2n,
  0x1761F93A44D5AEFEn,
  0x53898E4C3910DA55n,
  0x734DE8181F6EC39An,
  0x2680B122BAA28D97n,
  0x298AF231C85BAFABn,
  0x7983EED3740847D5n,
  0x66C1A2A1A60CD889n,
  0x9E17E49642A3E4C1n,
  0xEDB454E7BADC0805n,
  0x50B704CAB602C329n,
  0x4CC317FB9CDDD023n,
  0x66B4835D9EAFEA22n,
  0x219B97E26FFC81BDn,
  0x261E4E4C0A333A9Dn,
  0x1FE2CCA76517DB90n,
  0xD7504DFA8816EDBBn,
  0xB9571FA04DC089C8n,
  0x1DDC0325259B27DEn,
  0xCF3F4688801EB9AAn,
  0xF4F5D05C10CAB243n,
  0x38B6525C21A42B0En,
  0x36F60E2BA4FA6800n,
  0xEB3593803173E0CEn,
  0x9C4CD6257C5A3603n,
  0xAF0C317D32ADAA8An,
  0x258E5A80C7204C4Bn,
  0x8B889D624D44885Dn,
  0xF4D14597E660F855n,
  0xD4347F66EC8941C3n,
  0xE699ED85B0DFB40Dn,
  0x2472F6207C2D0484n,
  0xC2A1E7B5B459AEB5n,
  0xAB4F6451CC1D45ECn,
  0x63767572AE3D6174n,
  0xA59E0BD101731A28n,
  0x116D0016CB948F09n,
  0x2CF9C8CA052F6E9Fn,
  0x0B090A7560A968E3n,
  0xABEEDDB2DDE06FF1n,
  0x58EFC10B06A2068Dn,
  0xC6E57A78FBD986E0n,
  0x2EAB8CA63CE802D7n,
  0x14A195640116F336n,
  0x7C0828DD624EC390n,
  0xD74BBE77E6116AC7n,
  0x804456AF10F5FB53n,
  0xEBE9EA2ADF4321C7n,
  0x03219A39EE587A30n,
  0x49787FEF17AF9924n,
  0xA1E9300CD8520548n,
  0x5B45E522E4B1B4EFn,
  0xB49C3B3995091A36n,
  0xD4490AD526F14431n,
  0x12A8F216AF9418C2n,
  0x001F837CC7350524n,
  0x1877B51E57A764D5n,
  0xA2853B80F17F58EEn,
  0x993E1DE72D36D310n,
  0xB3598080CE64A656n,
  0x252F59CF0D9F04BBn,
  0xD23C8E176D113600n,
  0x1BDA0492E7E4586En,
  0x21E0BD5026C619BFn,
  0x3B097ADAF088F94En,
  0x8D14DEDB30BE846En,
  0xF95CFFA23AF5F6F4n,
  0x3871700761B3F743n,
  0xCA672B91E9E4FA16n,
  0x64C8E531BFF53B55n,
  0x241260ED4AD1E87Dn,
  0x106C09B972D2E822n,
  0x7FBA195410E5CA30n,
  0x7884D9BC6CB569D8n,
  0x0647DFEDCD894A29n,
  0x63573FF03E224774n,
  0x4FC8E9560F91B123n,
  0x1DB956E450275779n,
  0xB8D91274B9E9D4FBn,
  0xA2EBEE47E2FBFCE1n,
  0xD9F1F30CCD97FB09n,
  0xEFED53D75FD64E6Bn,
  0x2E6D02C36017F67Fn,
  0xA9AA4D20DB084E9Bn,
  0xB64BE8D8B25396C1n,
  0x70CB6AF7C2D5BCF0n,
  0x98F076A4F7A2322En,
  0xBF84470805E69B5Fn,
  0x94C3251F06F90CF3n,
  0x3E003E616A6591E9n,
  0xB925A6CD0421AFF3n,
  0x61BDD1307C66E300n,
  0xBF8D5108E27E0D48n,
  0x240AB57A8B888B20n,
  0xFC87614BAF287E07n,
  0xEF02CDD06FFDB432n,
  0xA1082C0466DF6C0An,
  0x8215E577001332C8n,
  0xD39BB9C3A48DB6CFn,
  0x2738259634305C14n,
  0x61CF4F94C97DF93Dn,
  0x1B6BACA2AE4E125Bn,
  0x758F450C88572E0Bn,
  0x959F587D507A8359n,
  0xB063E962E045F54Dn,
  0x60E8ED72C0DFF5D1n,
  0x7B64978555326F9Fn,
  0xFD080D236DA814BAn,
  0x8C90FD9B083F4558n,
  0x106F72FE81E2C590n,
  0x7976033A39F7D952n,
  0xA4EC0132764CA04Bn,
  0x733EA705FAE4FA77n,
  0xB4D8F77BC3E56167n,
  0x9E21F4F903B33FD9n,
  0x9D765E419FB69F6Dn,
  0xD30C088BA61EA5EFn,
  0x5D94337FBFAF7F5Bn,
  0x1A4E4822EB4D7A59n,
  0x6FFE73E81B637FB3n,
  0xDDF957BC36D8B9CAn,
  0x64D0E29EEA8838B3n,
  0x08DD9BDFD96B9F63n,
  0x087E79E5A57D1D13n,
  0xE328E230E3E2B3FBn,
  0x1C2559E30F0946BEn,
  0x720BF5F26F4D2EAAn,
  0xB0774D261CC609DBn,
  0x443F64EC5A371195n,
  0x4112CF68649A260En,
  0xD813F2FAB7F5C5CAn,
  0x660D3257380841EEn,
  0x59AC2C7873F910A3n,
  0xE846963877671A17n,
  0x93B633ABFA3469F8n,
  0xC0C0F5A60EF4CDCFn,
  0xCAF21ECD4377B28Cn,
  0x57277707199B8175n,
  0x506C11B9D90E8B1Dn,
  0xD83CC2687A19255Fn,
  0x4A29C6465A314CD1n,
  0xED2DF21216235097n,
  0xB5635C95FF7296E2n,
  0x22AF003AB672E811n,
  0x52E762596BF68235n,
  0x9AEBA33AC6ECC6B0n,
  0x944F6DE09134DFB6n,
  0x6C47BEC883A7DE39n,
  0x6AD047C430A12104n,
  0xA5B1CFDBA0AB4067n,
  0x7C45D833AFF07862n,
  0x5092EF950A16DA0Bn,
  0x9338E69C052B8E7Bn,
  0x455A4B4CFE30E3F5n,
  0x6B02E63195AD0CF8n,
  0x6B17B224BAD6BF27n,
  0xD1E0CCD25BB9C169n,
  0xDE0C89A556B9AE70n,
  0x50065E535A213CF6n,
  0x9C1169FA2777B874n,
  0x78EDEFD694AF1EEDn,
  0x6DC93D9526A50E68n,
  0xEE97F453F06791EDn,
  0x32AB0EDB696703D3n,
  0x3A6853C7E70757A7n,
  0x31865CED6120F37Dn,
  0x67FEF95D92607890n,
  0x1F2B1D1F15F6DC9Cn,
  0xB69E38A8965C6B65n,
  0xAA9119FF184CCCF4n,
  0xF43C732873F24C13n,
  0xFB4A3D794A9A80D2n,
  0x3550C2321FD6109Cn,
  0x371F77E76BB8417En,
  0x6BFA9AAE5EC05779n,
  0xCD04F3FF001A4778n,
  0xE3273522064480CAn,
  0x9F91508BFFCFC14An,
  0x049A7F41061A9E60n,
  0xFCB6BE43A9F2FE9Bn,
  0x08DE8A1C7797DA9Bn,
  0x8F9887E6078735A1n,
  0xB5B4071DBFC73A66n,
  0x230E343DFBA08D33n,
  0x43ED7F5A0FAE657Dn,
  0x3A88A0FBBCB05C63n,
  0x21874B8B4D2DBC4Fn,
  0x1BDEA12E35F6A8C9n,
  0x53C065C6C8E63528n,
  0xE34A1D250E7A8D6Bn,
  0xD6B04D3B7651DD7En,
  0x5E90277E7CB39E2Dn,
  0x2C046F22062DC67Dn,
  0xB10BB459132D0A26n,
  0x3FA9DDFB67E2F199n,
  0x0E09B88E1914F7AFn,
  0x10E8B35AF3EEAB37n,
  0x9EEDECA8E272B933n,
  0xD4C718BC4AE8AE5Fn,
  0x81536D601170FC20n,
  0x91B534F885818A06n,
  0xEC8177F83F900978n,
  0x190E714FADA5156En,
  0xB592BF39B0364963n,
  0x89C350C893AE7DC1n,
  0xAC042E70F8B383F2n,
  0xB49B52E587A1EE60n,
  0xFB152FE3FF26DA89n,
  0x3E666E6F69AE2C15n,
  0x3B544EBE544C19F9n,
  0xE805A1E290CF2456n,
  0x24B33C9D7ED25117n,
  0xE74733427B72F0C1n,
  0x0A804D18B7097475n,
  0x57E3306D881EDB4Fn,
  0x4AE7D6A36EB5DBCBn,
  0x2D8D5432157064C8n,
  0xD1E649DE1E7F268Bn,
  0x8A328A1CEDFE552Cn,
  0x07A3AEC79624C7DAn,
  0x84547DDC3E203C94n,
  0x990A98FD5071D263n,
  0x1A4FF12616EEFC89n,
  0xF6F7FD1431714200n,
  0x30C05B1BA332F41Cn,
  0x8D2636B81555A786n,
  0x46C9FEB55D120902n,
  0xCCEC0A73B49C9921n,
  0x4E9D2827355FC492n,
  0x19EBB029435DCB0Fn,
  0x4659D2B743848A2Cn,
  0x963EF2C96B33BE31n,
  0x74F85198B05A2E7Dn,
  0x5A0F544DD2B1FB18n,
  0x03727073C2E134B1n,
  0xC7F6AA2DE59AEA61n,
  0x352787BAA0D7C22Fn,
  0x9853EAB63B5E0B35n,
  0xABBDCDD7ED5C0860n,
  0xCF05DAF5AC8D77B0n,
  0x49CAD48CEBF4A71En,
  0x7A4C10EC2158C4A6n,
  0xD9E92AA246BF719En,
  0x13AE978D09FE5557n,
  0x730499AF921549FFn,
  0x4E4B705B92903BA4n,
  0xFF577222C14F0A3An,
  0x55B6344CF97AAFAEn,
  0xB862225B055B6960n,
  0xCAC09AFBDDD2CDB4n,
  0xDAF8E9829FE96B5Fn,
  0xB5FDFC5D3132C498n,
  0x310CB380DB6F7503n,
  0xE87FBB46217A360En,
  0x2102AE466EBB1148n,
  0xF8549E1A3AA5E00Dn,
  0x07A69AFDCC42261An,
  0xC4C118BFE78FEAAEn,
  0xF9F4892ED96BD438n,
  0x1AF3DBE25D8F45DAn,
  0xF5B4B0B0D2DEEEB4n,
  0x962ACEEFA82E1C84n,
  0x046E3ECAAF453CE9n,
  0xF05D129681949A4Cn,
  0x964781CE734B3C84n,
  0x9C2ED44081CE5FBDn,
  0x522E23F3925E319En,
  0x177E00F9FC32F791n,
  0x2BC60A63A6F3B3F2n,
  0x222BBFAE61725606n,
  0x486289DDCC3D6780n,
  0x7DC7785B8EFDFC80n,
  0x8AF38731C02BA980n,
  0x1FAB64EA29A2DDF7n,
  0xE4D9429322CD065An,
  0x9DA058C67844F20Cn,
  0x24C0E332B70019B0n,
  0x233003B5A6CFE6ADn,
  0xD586BD01C5C217F6n,
  0x5E5637885F29BC2Bn,
  0x7EBA726D8C94094Bn,
  0x0A56A5F0BFE39272n,
  0xD79476A84EE20D06n,
  0x9E4C1269BAA4BF37n,
  0x17EFEE45B0DEE640n,
  0x1D95B0A5FCF90BC6n,
  0x93CBE0B699C2585Dn,
  0x65FA4F227A2B6D79n,
  0xD5F9E858292504D5n,
  0xC2B5A03F71471A6Fn,
  0x59300222B4561E00n,
  0xCE2F8642CA0712DCn,
  0x7CA9723FBB2E8988n,
  0x2785338347F2BA08n,
  0xC61BB3A141E50E8Cn,
  0x150F361DAB9DEC26n,
  0x9F6A419D382595F4n,
  0x64A53DC924FE7AC9n,
  0x142DE49FFF7A7C3Dn,
  0x0C335248857FA9E7n,
  0x0A9C32D5EAE45305n,
  0xE6C42178C4BBB92En,
  0x71F1CE2490D20B07n,
  0xF1BCC3D275AFE51An,
  0xE728E8C83C334074n,
  0x96FBF83A12884624n,
  0x81A1549FD6573DA5n,
  0x5FA7867CAF35E149n,
  0x56986E2EF3ED091Bn,
  0x917F1DD5F8886C61n,
  0xD20D8C88C8FFE65Fn,
  0x31D71DCE64B2C310n,
  0xF165B587DF898190n,
  0xA57E6339DD2CF3A0n,
  0x1EF6E6DBB1961EC9n,
  0x70CC73D90BC26E24n,
  0xE21A6B35DF0C3AD7n,
  0x003A93D8B2806962n,
  0x1C99DED33CB890A1n,
  0xCF3145DE0ADD4289n,
  0xD0E4427A5514FB72n,
  0x77C621CC9FB3A483n,
  0x67A34DAC4356550Bn,
  0xF8D626AAAF278509n
];
var KeyGenerator = class {
  constructor() {
    this.bail_out = false;
    this.en_passant_row = -1;
    this.en_passant_column = -1;
    this.can_take_ep = false;
  }
  //
  // Utility function to convert BigInt values to hex string of fixed size
  //
  // noinspection JSUnusedGlobalSymbols
  bn2hex(bn, the_size) {
    let hex = bn.toString();
    while (hex.length < the_size) {
      hex = "0" + hex;
    }
    return "0x" + hex;
  }
  //
  // XOR current hash value with specified random value from the table above
  //
  xor_with_random(weed, num) {
    return weed ^ random64[num];
  }
  //
  // Parse en-passant part from FEN string and set (global) vars accordingly
  //
  parse_en_passant(str) {
    if (!str || str === "-") {
      return;
    }
    if (str.length !== 2) {
      this.bail_out = true;
      return;
    }
    const col = str.charCodeAt(0) - 97;
    const row = str.charCodeAt(1) - 49;
    if (col < 0 || col > 7 || row < 0 || row > 7) {
      this.bail_out = true;
      return;
    }
    this.en_passant_column = col;
    this.en_passant_row = row;
  }
  //
  // Include side to move in hash.
  //
  // Note: NOP for black to move
  //
  hash_color_to_move(arr, str) {
    if (str === "w") {
      return this.xor_with_random(arr, 780);
    } else if (str !== "b") {
      this.bail_out = true;
    }
    return arr;
  }
  //
  // Include castling rights in hash.
  //
  hash_castle(weed, str) {
    if (str === "-") {
      return weed;
    }
    if (str.search("K") !== -1) {
      weed = this.xor_with_random(weed, 768);
    }
    if (str.search("Q") !== -1) {
      weed = this.xor_with_random(weed, 769);
    }
    if (str.search("k") !== -1) {
      weed = this.xor_with_random(weed, 770);
    }
    if (str.search("q") !== -1) {
      weed = this.xor_with_random(weed, 771);
    }
    return weed;
  }
  //
  // Compute hash based on location of pieces on the board
  //
  // weed = initial hash value (BigInt to hold 64-bit integers)
  // str = first part of FEN string (containing location of pieces)
  //
  hash_pieces(weed, str) {
    const rows = str.split("/");
    if (rows.length !== 8) {
      this.bail_out = true;
      return weed;
    }
    for (let i2 = 0; i2 < 8; i2++) {
      let col = 0;
      const row = 7 - i2;
      for (let j = 0; j < rows[i2].length; j++) {
        switch (rows[i2][j]) {
          //
          // Check for possible en-passant captures
          //
          case "p":
            weed = this.xor_with_random(weed, 8 * row + col);
            if (this.en_passant_row === 2 && row === 3 && this.en_passant_column > 0 && col === this.en_passant_column - 1)
              this.can_take_ep = true;
            if (this.en_passant_row === 2 && row === 3 && this.en_passant_column < 7 && col === this.en_passant_column + 1)
              this.can_take_ep = true;
            col++;
            break;
          case "P":
            weed = this.xor_with_random(weed, 64 + 8 * row + col);
            if (this.en_passant_row === 5 && row === 4 && this.en_passant_column > 0 && col === this.en_passant_column - 1)
              this.can_take_ep = true;
            if (this.en_passant_row === 5 && row === 4 && this.en_passant_column < 7 && col === this.en_passant_column + 1)
              this.can_take_ep = true;
            col++;
            break;
          case "n":
            weed = this.xor_with_random(weed, 64 * 2 + 8 * row + col);
            col++;
            break;
          case "N":
            weed = this.xor_with_random(weed, 64 * 3 + 8 * row + col);
            col++;
            break;
          case "b":
            weed = this.xor_with_random(weed, 64 * 4 + 8 * row + col);
            col++;
            break;
          case "B":
            weed = this.xor_with_random(weed, 64 * 5 + 8 * row + col);
            col++;
            break;
          case "r":
            weed = this.xor_with_random(weed, 64 * 6 + 8 * row + col);
            col++;
            break;
          case "R":
            weed = this.xor_with_random(weed, 64 * 7 + 8 * row + col);
            col++;
            break;
          case "q":
            weed = this.xor_with_random(weed, 64 * 8 + 8 * row + col);
            col++;
            break;
          case "Q":
            weed = this.xor_with_random(weed, 64 * 9 + 8 * row + col);
            col++;
            break;
          case "k":
            weed = this.xor_with_random(weed, 64 * 10 + 8 * row + col);
            col++;
            break;
          case "K":
            weed = this.xor_with_random(weed, 64 * 11 + 8 * row + col);
            col++;
            break;
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
            const r = rows[i2].charCodeAt(j) - 48;
            col += r;
            break;
          default:
            this.bail_out = true;
            return weed;
        }
      }
      if (col !== 8)
        this.bail_out = true;
    }
    return weed;
  }
  //
  // Generate hash based on FEN string
  //
  compute_fen_hash(fenstring) {
    this.en_passant_row = -1;
    this.en_passant_column = -1;
    this.can_take_ep = false;
    let hash = 0n;
    const fen = fenstring.trim().split(" ");
    if (fen.length !== 6) {
      return null;
    }
    this.parse_en_passant(fen[3]);
    hash = this.hash_pieces(hash, fen[0]);
    if (this.can_take_ep) {
      hash = this.xor_with_random(hash, 772 + this.en_passant_column);
    }
    hash = this.hash_color_to_move(hash, fen[1]);
    hash = this.hash_castle(hash, fen[2]);
    return hash;
  }
};

// node_modules/cm-polyglot/src/Polyglot.js
var Polyglot = class {
  constructor(url) {
    this.book = null;
    this.initialisation = new Promise((resolve) => {
      this.fetchBook(url).then((book) => {
        this.book = book;
        resolve();
      });
    });
    this.keyGenerator = new KeyGenerator();
  }
  /**
      @returns move { from: 'h7', to:'h8', promotion: 'q' }
   */
  entryToMove(bookEntry) {
    const move = {
      from: void 0,
      to: void 0,
      promotion: void 0
    };
    const files = "abcdefgh";
    const promoPieces = " nbrq";
    move.from = files[bookEntry.get_from_col()];
    move.from = "" + move.from + (bookEntry.get_from_row() + 1);
    move.to = files[bookEntry.get_to_col()];
    move.to = "" + move.to + (bookEntry.get_to_row() + 1);
    if (bookEntry.get_promo_piece() > 0) {
      move.promotion = promoPieces[bookEntry.get_promo_piece()];
    }
    if (bookEntry.isOOW()) {
      move.to = "g1";
    } else if (bookEntry.isOOOW()) {
      move.to = "c1";
    } else if (bookEntry.isOOB()) {
      move.to = "g8";
    } else if (bookEntry.isOOOB()) {
      move.to = "c8";
    }
    move.weight = bookEntry.weight;
    return move;
  }
  async getMovesFromFen(fen, weightPower = 0.2) {
    return new Promise((resolve) => {
      this.initialisation.then(() => {
        const hash = this.keyGenerator.compute_fen_hash(fen);
        const bookEntries = this.book.get_all_moves(hash);
        const moves = [];
        let weightSum = 0;
        for (const bookEntry of bookEntries) {
          moves.push(this.entryToMove(bookEntry));
          weightSum += bookEntry.weight;
        }
        for (const move of moves) {
          move.probability = Math.pow(move.weight / weightSum, weightPower).toFixed(1);
        }
        resolve(moves);
      });
    });
  }
  fetchBook(url) {
    return new Promise((resolve, reject) => {
      fetch(url).then((response) => {
        response.blob().then((blob) => {
          let reader = new FileReader();
          reader.readAsBinaryString(blob);
          reader.onload = () => {
            resolve(new Book(reader.result));
          };
          reader.onerror = () => {
            reject(reader.error);
          };
        });
      });
    });
  }
};

// node_modules/cm-engine-runner/src/PolyglotRunner.js
var PolyglotRunner = class extends EngineRunner {
  constructor(props) {
    super(props);
  }
  init() {
    this.polyglot = new Polyglot(this.props.bookUrl);
    this.polyglot.initialisation.then(() => {
      this.engineState = ENGINE_STATE.READY;
      return Promise.resolve();
    });
  }
  calculateMove(fen, props = {}) {
    this.engineState = ENGINE_STATE.THINKING;
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(async () => {
        resolve();
      }, this.props.responseDelay);
    });
    const calculationPromise = new Promise(async (resolve) => {
      const moves = await this.polyglot.getMovesFromFen(fen);
      if (this.props.debug) {
        console.log(fen, "moves found in opening book", moves);
      }
      const propabilityMatrix = [];
      for (const move of moves) {
        for (let i2 = 0; i2 < move.probability * 10; i2++) {
          propabilityMatrix.push(move);
        }
      }
      const luckyIndex = Math.floor(Math.random() * propabilityMatrix.length);
      resolve(propabilityMatrix[luckyIndex]);
    });
    return new Promise((resolve) => {
      Promise.all([this.initialized, timeoutPromise, calculationPromise]).then((values) => {
        this.engineState = ENGINE_STATE.READY;
        resolve(values[2]);
      });
    });
  }
};

// src/StockfishPlayer.js
var StockfishPlayer = class extends ChessConsolePlayer {
  constructor(chessConsole, name, props) {
    super(chessConsole, name);
    this.props = {
      debug: false
    };
    Object.assign(this.props, props);
    this.engineRunner = new StockfishRunner({ workerUrl: props.worker, debug: props.debug });
    this.openingRunner = props.book ? new PolyglotRunner({ bookUrl: props.book }) : this.engineRunner;
    this.state = {
      scoreHistory: {},
      score: null,
      level: props.level,
      engineState: ENGINE_STATE.LOADING,
      currentRunner: this.openingRunner
    };
    this.initialisation = Promise.all([this.openingRunner.initialization, this.engineRunner.initialization]);
    this.initialisation.then(() => {
      this.state.engineState = ENGINE_STATE.LOADED;
    });
    this.i18n = chessConsole.i18n;
    this.i18n.load({
      de: {
        score: "Bewertung",
        level: "Stufe"
      },
      en: {
        score: "Score",
        level: "Level"
      }
    });
    this.chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.load, () => {
      if (this.chessConsole.persistence.loadValue("level")) {
        this.state.level = parseInt(this.chessConsole.persistence.loadValue("level"), 10);
      }
      if (this.chessConsole.persistence.loadValue("scoreHistory")) {
        this.state.scoreHistory = this.chessConsole.persistence.loadValue("scoreHistory");
        let score = this.state.scoreHistory[this.chessConsole.state.plyViewed];
        if (!score && this.chessConsole.state.plyViewed > 0) {
          score = this.state.scoreHistory[this.chessConsole.state.plyViewed - 1];
        }
        this.state.score = score;
      }
    });
    this.chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.moveUndone, () => {
      this.state.currentRunner = this.openingRunner;
    });
    this.chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.newGame, () => {
      this.state.scoreHistory = {};
      this.state.score = 0;
    });
    this.chessConsole.messageBroker.subscribe(CONSOLE_MESSAGE_TOPICS.initGame, (data) => {
      if (data.props.engineLevel) {
        this.state.level = data.props.engineLevel;
      }
      this.state.currentRunner = this.openingRunner;
    });
    Observe.property(this.state, "level", () => {
      this.chessConsole.persistence.saveValue("level", this.state.level);
    });
    Observe.property(this.state, "score", () => {
      this.chessConsole.persistence.saveValue("score", this.state.score);
      this.chessConsole.persistence.saveValue("scoreHistory", this.state.scoreHistory);
    });
  }
  moveRequest(fen, moveResponse) {
    if (this.props.debug) {
      console.log("moveRequest", fen);
    }
    this.initialisation.then(async () => {
      this.state.engineState = ENGINE_STATE.THINKING;
      if (this.state.level < 3) {
        this.state.currentRunner = this.engineRunner;
      }
      let nextMove = await this.state.currentRunner.calculateMove(fen, { level: this.state.level });
      if (!nextMove) {
        if (this.props.debug) {
          console.log("no move found with", this.state.currentRunner.constructor.name);
        }
        if (this.state.currentRunner === this.openingRunner) {
          this.state.currentRunner = this.engineRunner;
          this.moveRequest(fen, moveResponse);
        } else {
          throw new Error("can't find move with fen " + fen + " and runner " + this.state.currentRunner);
        }
      } else {
        if (this.props.debug) {
          console.log("this.state.currentRunner", this.state.currentRunner);
          console.log("nextMove", nextMove, this.state.currentRunner.constructor.name);
        }
        let newScore = void 0;
        if (nextMove.score !== void 0) {
          if (!isNaN(nextMove.score)) {
            newScore = -nextMove.score;
          } else {
            newScore = nextMove.score;
          }
          this.state.scoreHistory[this.chessConsole.state.chess.plyCount()] = newScore;
          this.state.score = newScore;
        } else {
          this.state.score = void 0;
        }
        this.state.engineState = ENGINE_STATE.READY;
        moveResponse(nextMove);
      }
    });
  }
};

// src/StockfishStateView.js
var StockfishStateView = class extends UiComponent {
  /**
   * @param chessConsole
   * @param player
   * @param props // { spinnerIcon: spinner }
   */
  constructor(chessConsole, player, props = {}) {
    super(void 0, props);
    this.chessConsole = chessConsole;
    this.player = player;
    const i18n = chessConsole.i18n;
    if (!this.props.spinnerIcon) {
      this.props.spinnerIcon = "spinner";
    }
    this.numberFormat = new Intl.NumberFormat(i18n.locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
    this.element = this.chessConsole.context.querySelector(".engine-state");
    this.element.innerHTML = `<span class="score text-muted"></span> <span class="thinking text-muted"><i class="fas fa-${this.props.spinnerIcon} fa-spin"></i></span>`;
    this.scoreElement = this.element.querySelector(".score");
    this.thinkingElement = this.element.querySelector(".thinking");
    this.thinkingElement.style.display = "none";
    Observe.property(player.state, "level", () => {
      this.updatePlayerName();
    });
    Observe.property(player.state, "engineState", () => {
      if (player.state.engineState === ENGINE_STATE.THINKING) {
        this.thinkingElement.style.display = "";
      } else {
        this.thinkingElement.style.display = "none";
      }
    });
    Observe.property(player.state, "score", (event) => {
      const newScore = event.newValue;
      if (newScore) {
        let scoreFormatted;
        if (isNaN(newScore)) {
          scoreFormatted = newScore;
        } else {
          scoreFormatted = this.numberFormat.format(newScore);
        }
        this.scoreElement.innerHTML = `${i18n.t("score")} ${scoreFormatted}`;
      } else {
        this.scoreElement.innerHTML = ``;
      }
    });
    Observe.property(this.chessConsole.state, "plyViewed", () => {
      let score = player.state.scoreHistory[this.chessConsole.state.plyViewed];
      if (!score && this.chessConsole.state.plyViewed > 0) {
        score = player.state.scoreHistory[this.chessConsole.state.plyViewed - 1];
      }
      if (score) {
        let scoreFormatted;
        if (isNaN(score)) {
          scoreFormatted = score;
        } else {
          scoreFormatted = this.numberFormat.format(score);
        }
        this.scoreElement.innerHTML = `${i18n.t("score")} ${scoreFormatted}`;
      } else {
        this.scoreElement.innerHTML = "";
      }
    });
    this.updatePlayerName();
  }
  updatePlayerName() {
    this.player.name = `Stockfish ${this.chessConsole.i18n.t("level")} ${this.player.state.level}`;
  }
};
export {
  Board,
  CapturedPieces,
  ChessConsole,
  GameStateOutput,
  History2 as History,
  HistoryControl,
  I18n,
  LocalPlayer,
  Persistence,
  Sound,
  StockfishGameControl,
  StockfishNewGameDialog,
  StockfishPlayer,
  StockfishStateView
};
//# sourceMappingURL=chess-console-stockfish.js.map
