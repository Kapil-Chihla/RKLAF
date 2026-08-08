/** Fallback desk stories when API is empty / offline */
export const FALLBACK_DESK = [
  {
    id: 'fallback-1',
    slug: 'built-from-one-wave-of-evictions',
    number: 1,
    kicker: 'Senior Citizens',
    title: 'Built from one wave of evictions',
    listingDescription:
      'In 2018 our helpline began ringing with the same story told in different voices: parents moved into storerooms of houses they built, gift deeds signed under pressure, patience mistaken for consent. The desk was built to answer that exact call, and it has never stopped.\n\nA single case officer stays with each elder from intake to compliance. Volunteers sit beside them at every hearing, so nobody faces a tribunal alone at seventy.',
    featureBlurb: 'One officer, one volunteer, one file — elders protected from coerced gift deeds to restored homes.',
    heroImage: null,
    fullHeader: 'Four hundred elders, one method',
    fullBody:
      'How the Senior Citizens Protection Desk works — from the first helpline call to the order that restores a home, and the volunteer who sits through every hearing.\n\nEach matter begins on the helpline. A case officer opens a file, gathers the deed papers, and stays with the elder through every tribunal date. Volunteers sit beside them so nobody faces the bench alone.\n\nOrders are followed through to compliance: possession restored, gift deeds cancelled, maintenance paid. That method — one officer, one volunteer, one file — is how four hundred elders have been protected since the desk opened.',
    gallery: [],
  },
];

export function deskStoryHref(story) {
  const slug =
    story.slug ||
    String(story.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  return slug ? `/our-work/desk/${slug}` : null;
}
