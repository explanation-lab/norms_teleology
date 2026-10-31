"""Build deterministic, self-contained review and Console-converter source ZIPs."""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'code/experiments/study1'
OUT = ROOT / 'dist'
MATERIALS = (SOURCE / 'js/materials.js').read_text()
VERSION = re.search(r"version: '([^']+)'", MATERIALS).group(1)
DEMOGRAPHIC_FIELDS = json.loads(re.search(r'demographicFields: (\[[^\]]*\])', MATERIALS).group(1))


def build(kind):
    files = {p.relative_to(SOURCE).as_posix(): p.read_bytes()
             for p in sorted(SOURCE.rglob('*')) if p.is_file() and not p.name.startswith('.')}
    if kind == 'upload':
        files['review.html'] = files['index.html']
        files['index.html'] = files.pop('collection.html')
        options = {'experimentVersion': VERSION,
                   'conditionCodes': ['control', 'survival', 'ecology'],
                   'demographicFields': DEMOGRAPHIC_FIELDS, 'noDemographics': False,
                   'assignmentType': 'between_participant'}
        digest = hashlib.sha256()
        for name, content in sorted(files.items()):
            digest.update(f'{name}\n{len(content)}\n'.encode())
            digest.update(content)
        digest.update(json.dumps(options, separators=(',', ':')).encode())
        fingerprint = digest.hexdigest()
        config = {
            'format': 'explanation-lab-study-config', 'manifestVersion': '1.2.0',
            'schemaVersion': '2.0.0', 'preparedAt': '2026-10-31',
            'sourceZip': 'norms-teleology-study1-upload.zip', 'jsPsychVersion': '7.3.4',
            'experimentVersion': options['experimentVersion'], 'clientVersion': '1.5.1',
            'assignmentType': 'between_participant', 'launchAssignmentParameter': 'condition',
            'launchConditions': options['conditionCodes'], 'conditions': options['conditionCodes'],
            'internalFactors': [], 'internalConditionCells': [], 'demographicsConfirmed': True,
            'demographicFields': DEMOGRAPHIC_FIELDS, 'conversionOutcome': 'ready',
            'packageFingerprint': fingerprint, 'originalBackupPaths': []
        }
        files['explanation-lab.config.json'] = (json.dumps(config, indent=2) + '\n').encode()
        files['CONSOLE_SETUP.txt'] = (
            'Console-connected upload package. The official Console converter verified\n'
            'the initial integration structure, assignment wiring and three conditions\n'
            'on October 31, 2026. Version 1.1.0 replaces the standalone feedback screen\n'
            'with optional age, gender, race and ethnicity fields from Purpose Norms.\n'
            'Final source and collection mappings are covered by runtime tests.\n'
            'This manifest and fingerprint are reproducibly generated from final source\n'
            'by tools/package_study.py, rather than reusing the earlier conversion hash.\n'
            '\nPublish the entire folder. Register its public study URL in project\n'
            'NORMS-TELEOLOGY-S6P2. Use equal condition targets after choosing total N.\n'
            'Confirm duration/payment and Prolific completion details. Run all three\n'
            'Sandbox groups and verify their exports before any recruitment.\n'
            'No public hosting or live Sandbox submissions were performed in this build.\n'
        ).encode()
    else:
        for name in ('collection.html', 'js/collection.js', 'explanation-lab-client.js'):
            files.pop(name, None)
    manifest = {name: hashlib.sha256(content).hexdigest() for name, content in files.items()}
    files['PACKAGE_MANIFEST.json'] = (json.dumps({'package': kind, 'version': VERSION, 'sha256': manifest}, indent=2) + '\n').encode()
    path = OUT / f'norms-teleology-study1-{kind}.zip'
    with ZipFile(path, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for name, content in sorted(files.items()):
            info = ZipInfo(name, (2026, 10, 31, 12, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            archive.writestr(info, content)
    print(f'{path} ({path.stat().st_size:,} bytes)')


if __name__ == '__main__':
    OUT.mkdir(exist_ok=True)
    for kind in ('review', 'upload'):
        build(kind)
