/**
 * PIN 해시 생성 스크립트
 * 사용법: node scripts/gen-pin-hash.mjs 123456
 * 출력된 해시를 GitHub Actions secret VITE_PIN_HASH 에 저장하세요.
 */
import { createHash } from 'crypto'

const pin = process.argv[2]
if (!pin) {
  console.error('Usage: node scripts/gen-pin-hash.mjs <your-pin>')
  process.exit(1)
}

const hash = createHash('sha256').update(pin).digest('hex')
console.log('\n✅ PIN 해시 생성 완료\n')
console.log('GitHub Actions secret 에 저장할 값:')
console.log('  이름: VITE_PIN_HASH')
console.log(`  값:   ${hash}`)
console.log('\nGitHub → Settings → Secrets and variables → Actions → New repository secret')
