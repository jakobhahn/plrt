// NextAuth v5 beta - types may not be available
type OAuthConfig<T> = any
type OAuthUserConfig<T> = any

export interface StravaProfile {
  id: number
  username: string
  firstname: string
  lastname: string
  profile_medium: string
  profile: string
}

export default function StravaProvider(
  options: OAuthUserConfig<StravaProfile>
): OAuthConfig<StravaProfile> {
  return {
    id: 'strava',
    name: 'Strava',
    type: 'oauth',
    authorization: {
      url: 'https://www.strava.com/oauth/authorize',
      params: {
        scope: 'read,activity:read',
        approval_prompt: 'force',
        response_type: 'code',
      },
    },
    token: 'https://www.strava.com/oauth/token',
    userinfo: 'https://www.strava.com/api/v3/athlete',
    profile(profile: StravaProfile) {
      return {
        id: profile.id.toString(),
        name: `${profile.firstname} ${profile.lastname}`,
        email: null,
        image: profile.profile_medium || profile.profile,
      }
    },
    ...options,
  }
}
