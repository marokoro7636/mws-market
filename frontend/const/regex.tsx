const githubReg = new RegExp(/^https:\/\/github.com\/.+$/)
const githubReleaseReg = new RegExp(/^https:\/\/github.com\/[^\/]+\/[^\/]+\/releases$/)
const gitlabReg = new RegExp(/^https:\/\/gitlab.com\/.+$/)

export {
    githubReg,
    githubReleaseReg,
    gitlabReg
}