import {getAllLunches} from './actions'
import {LunchGallery} from './lunch-gallery'

export const LunchDashboardPage = async () => {
    const lunches = await getAllLunches()

    return <LunchGallery initialLunches={lunches}/>
}
