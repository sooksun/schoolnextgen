/**
 * Scope type shared between `lib/scope/can.ts` (permission helpers) and
 * `server/tenant/scope.ts` (runtime resolver).
 *
 * Lives in `lib/` so the dependency direction is `server/* → lib/*` only.
 * Resolves architecture rule §12: "lib/* can import from lib/* only."
 */

export type Scope = {
  user: { id: string; personId: string; email: string }
  membershipId: string
  schoolId: string
  schoolName: string
  academicYearId: string
  academicYearLabel: string
  academicTermId: string | null
  academicTermName: string | null
  role: string
  roleName: string
  departmentId: string | null
  classroomId: string | null
  classroomName: string | null
}
