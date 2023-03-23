import sortObjectByPrio from './sortObjectByPrio'

describe('sortObjectByPrio', () => {
  test('main', () => {
    expect(
      Object.keys(
        sortObjectByPrio(
          {
            generated_upload_required: true,
            title: 'Automatic Face Detection Service',
            run_instructions: 'Please upload an image with faces to run the demo.',
            redirect_from: '/demos/image-manipulation/detect-faces-in-images/',
            generated_hash: '136d8a55e5aedae8071b12378cbfc851',
          },
          {
            _: ['redirect_to', 'warning', 'title', 'meta_description'],
            z: [/^generated_/],
          }
        )
      )
    ).toStrictEqual([
      'title',
      'redirect_from',
      'run_instructions',
      'generated_hash',
      'generated_upload_required',
    ])
  })
})
