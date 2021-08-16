import { CoursePreviewCard } from '@/views/post/CoursePreviewCard'
import type { CourseListItem } from '@/views/post/getCourseListData'

export interface CoursesListProps {
  courses: Array<CourseListItem>
}

/**
 * Lists one page of courses.
 */
export function CoursesList(props: CoursesListProps): JSX.Element {
  const { courses } = props

  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => {
        return (
          <li key={course.id}>
            <CoursePreviewCard course={course} />
          </li>
        )
      })}
    </ul>
  )
}
