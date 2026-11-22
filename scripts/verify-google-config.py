#!/usr/bin/env python3
"""Validate client configuration without logging identifiers, tokens or secrets."""
import json
import re
import sys
from pathlib import Path


def validate(config):
    assert config.get('project_info', {}).get('project_id') == 'hangagbg', 'Wrong Firebase project'
    clients = [c for c in config.get('client', []) if
               c.get('client_info', {}).get('android_client_info', {}).get('package_name') == 'se.hangagbg.android']
    assert len(clients) == 1, 'Missing or ambiguous Android app configuration'
    client = clients[0]
    assert client['client_info'].get('mobilesdk_app_id') == '1:307954822402:android:5d1d3d4a5a2666103ce61b', 'Wrong Firebase Android App ID'
    oauth = client.get('oauth_client', [])
    web = [c for c in oauth if c.get('client_type') == 3 and c.get('client_id', '').endswith('.apps.googleusercontent.com')]
    assert web, 'Missing Web OAuth client: enable Google provider and download google-services.json again'
    expected = 'E532CD76791F3DD24C1B8C02F2494D7CB511155D'
    android = [c.get('android_info', {}) for c in oauth if c.get('client_type') == 1]
    assert any(c.get('package_name') == 'se.hangagbg.android' and
               re.sub('[^0-9A-F]', '', c.get('certificate_hash', '').upper()) == expected for c in android), \
        'Missing registered Play signing SHA-1: add the Play certificate and refresh the GitHub Firebase secret'


if __name__ == '__main__':
    try:
        validate(json.loads(Path(sys.argv[1]).read_text()))
    except (AssertionError, OSError, ValueError, IndexError, TypeError, KeyError) as error:
        print('Google sign-in configuration check failed:', str(error) if isinstance(error, AssertionError) else 'Invalid or missing configuration file')
        sys.exit(1)
    print('Google sign-in configuration verified: project, Android app, Web OAuth and Play signing certificate.')
