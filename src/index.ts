import { execa, execaCommand } from 'execa'

const branches: Record<string, string> = {
  t: 'test',
  test: 'test',
  r: 'release',
  release: 'release',
  r2: 'release2',
  release2: 'release2',
};

(async() => {
  const input = process.argv.slice(2)[0] as string
  const rawBranch = branches[input]
  let targetBranch = rawBranch

  if (!targetBranch) {
    console.error('目标分支匹配失败，仅允许 \n', JSON.stringify(branches, null, 2))
    return
  }

  try {
    const { stdout: currentBranch } = await execaCommand('git branch --show-current')

    if (currentBranch) targetBranch = `temp-${currentBranch}-${targetBranch}-${today()}`
    if (targetBranch) {
      await execa('git', ['checkout', '-b', targetBranch])
      await execa('git', ['merge', `origin/${rawBranch}`])
    }
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
