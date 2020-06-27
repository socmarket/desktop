async function ifF(cond, f) {
  const condr = await Promise.resolve(cond)
  if (condr) {
    return f()
  } else return Promise.resolve()
}

async function ifNotF(cond, f) {
  const condr = await Promise.resolve(cond)
  if (!condr) {
    return f()
  } else return Promise.resolve()
}


async function traverseF(list, f) {
  var p = Promise.resolve()
  var i = 0
  while (i < list.length) {
    await Promise.resolve(p)
    p = f(list[i])
    ++i
  }
  return p
}

export { traverseF, ifF, ifNotF }
