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

function groupBy(lens, items, maxf) {
  var maxK = ""
  var prev = ""
  var curr = false
  var result = []
  items.forEach(item => {
    const key = lens(item)
    const keyM = maxf(item)
    if (keyM > maxK)
      maxK = keyM
    if (key !== prev) {
      prev = key
      if (curr) {
        result.push(curr)
      }
      curr = {
        key: key,
        maxKey: maxK,
        items: [ item ],
      }
      maxK = ""
    } else {
      curr.items.push(item)
      curr.maxKey = maxK
    }
  })
  if (curr)
    result.push(curr)
  return result
}

export { traverseF, ifF, ifNotF, groupBy }
