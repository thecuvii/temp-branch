import { execa, execaCommand } from 'execa'

const branches = {
  t: 'test',
  test: 'test',
  r: 'release',
  release: 'release',
  r2: 'release2',
  release2: 'release2',
};

(async() => {
  let targetBranch = process.argv.slice(2)[0]

  if (!targetBranch) {
    console.error('目标分支匹配失败，仅允许 \n', JSON.stringify(branches, null, 2))
    return
  }

  try {
    const { stdout: currentBranch } = await execaCommand('git branch --show-current')

    if (currentBranch) targetBranch = `temp-${currentBranch}-${targetBranch}-${today()}`
    if (targetBranch) await execa('git', ['checkout', '-b', targetBranch])
  }
  catch (e: unknown) {
    const { message } = e as any
    console.error(message)
  }
})()

function today() {
  const date = new Date()
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')
}
