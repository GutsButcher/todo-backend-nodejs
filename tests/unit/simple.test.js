describe('Simple Test Suite', () => {
  test('Basic math operations', () => {
    expect(2 + 2).toBe(4)
    expect(5 * 3).toBe(15)
    expect(10 / 2).toBe(5)
  })

  test('String operations', () => {
    const str = 'Hello World'
    expect(str).toContain('World')
    expect(str.length).toBe(11)
  })

  test('Array operations', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(arr).toHaveLength(5)
    expect(arr).toContain(3)
    expect(arr[0]).toBe(1)
  })

  test('Object operations', () => {
    const obj = { name: 'Test', value: 42 }
    expect(obj).toHaveProperty('name')
    expect(obj.name).toBe('Test')
    expect(obj.value).toBe(42)
  })
})