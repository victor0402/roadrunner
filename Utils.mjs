const hash = function (s) {
  /* Simple hash function. */
  var a = 1, c = 0, h, o;
  if (s) {
    a = 0;
    /*jshint plusplus:false bitwise:false*/
    for (h = s.length - 1; h >= 0; h--) {
      o = s.charCodeAt(h);
      a = (a << 6 & 268435455) + o + (o << 14);
      c = a & 266338304;
      a = c !== 0 ? a ^ c >> 21 : a;
    }
  }
  return String(a);
};

const getSlackTSHash = ({ branchName, repositoryName, pullRequestID }) => (
  hash(`${branchName}${repositoryName}${pullRequestID}`)
)

const getPRIDHash = ({ branchName, repositoryName }) => (
  hash(`${branchName}${repositoryName}`)
)

exports.getSlackTSHash = getSlackTSHash
exports.getPRIDHash = getPRIDHash